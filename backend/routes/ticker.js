// routes/ticker.js
import express from "express";
import { io } from "socket.io-client";

const API_URL  = (process.env.API_URL || "https://tournaments.ncpaofficial.com").replace(/\/$/, "");
const API_KEY  = process.env.API_KEY || "password";
const DEFAULT_MATCH_ID = Number(process.env.MATCH_ID || 8859);

// (optional) simple shared secret for the POST; set in .env
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

const router = express.Router();

// --- Global state (single instance) ---
let currentMatchId = DEFAULT_MATCH_ID;
let socket = null;
const cache = { data: null, lastUpdated: null };
const clients = new Set();

// --- Helpers ---
async function fetchSnapshot(matchId) {
  const res = await fetch(
    `${API_URL}/api/get-games/?key=${encodeURIComponent(API_KEY)}&match_id=${encodeURIComponent(matchId)}`
  );
  cache.data = await res.json();
  cache.lastUpdated = new Date().toISOString();
}

function broadcast() {
  const payload = `data: ${JSON.stringify({ matchId: currentMatchId, lastUpdated: cache.lastUpdated, data: cache.data })}\n\n`;
  for (const res of clients) res.write(payload);
}

function stopSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.close();
    socket = null;
  }
}

function startSocket(matchId) {
  stopSocket();
  socket = io(API_URL, {
    transports: ["polling", "websocket"],
    query: { key: API_KEY },
    extraHeaders: { Origin: API_URL },
  });

  socket.on("connect", () => socket.emit("subscribeToGameUpdates", matchId));
  socket.on("updateGames", (payload) => {
    cache.data = payload;
    cache.lastUpdated = new Date().toISOString();
    broadcast();
  });
}

// Switch the global match, refresh snapshot, and re-subscribe
async function setMatch(matchId) {
  if (!Number.isFinite(matchId)) throw new Error("Invalid match_id");
  if (matchId === currentMatchId && cache.data) return; // nothing to do
  currentMatchId = matchId;
  await fetchSnapshot(matchId);
  startSocket(matchId);
  broadcast();
}

// --- Endpoints ---

// SSE stream (single endpoint for all clients, always the current global match)
router.get("/", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",  // tighten in production
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  // Send current snapshot immediately (fetch if empty)
  if (!cache.data) {
    try { await fetchSnapshot(currentMatchId); } catch {}
  }
  res.write(`data: ${JSON.stringify({ matchId: currentMatchId, lastUpdated: cache.lastUpdated, data: cache.data })}\n\n`);

  clients.add(res);
  const ping = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => { clearInterval(ping); clients.delete(res); });
});

// Change the global match (simple JSON body: { "match_id": 1234 })
router.post("/match", express.json(), async (req, res) => {
  try {
    if (ADMIN_TOKEN && req.headers["x-admin-token"] !== ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    const next = Number(req.body?.match_id);
    await setMatch(next);
    res.json({ ok: true, matchId: currentMatchId });
  } catch (e) {
    res.status(400).json({ ok: false, error: e?.message || "bad request" });
  }
});

// --- Bootstrap ---
(async () => {
  try { await fetchSnapshot(currentMatchId); } catch {}
  startSocket(currentMatchId);
})();

export default router;
