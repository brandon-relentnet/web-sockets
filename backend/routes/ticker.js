// routes/ticker.js
import express from "express";
import { io } from "socket.io-client";

const API_URL  = (process.env.API_URL || "https://tournaments.ncpaofficial.com").replace(/\/$/, "");
const API_KEY  = process.env.API_KEY || "password";
const MATCH_ID = Number(process.env.MATCH_ID || 8859);

const cache = { data: null, lastUpdated: null };

async function loadInitial() {
  const res = await fetch(
    `${API_URL}/api/get-games/?key=${encodeURIComponent(API_KEY)}&match_id=${encodeURIComponent(MATCH_ID)}`
  );
  cache.data = await res.json();
  cache.lastUpdated = new Date().toISOString();
}

function startWS() {
  const socket = io(API_URL, {
    transports: ["polling", "websocket"],
    query: { key: API_KEY },
    extraHeaders: { Origin: API_URL },
  });

  socket.on("connect", () => {
    socket.emit("subscribeToGameUpdates", MATCH_ID);
  });

    socket.on("updateGames", (payload) => {
    cache.data = payload;
    cache.lastUpdated = new Date().toISOString();
    broadcast();
    });
}

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    lastUpdated: cache.lastUpdated,
    data: cache.data ?? { message: "No game data yet..." },
  });
});

(async () => {
  try { await loadInitial(); broadcast(); } catch {}
  startWS();
})();

export default router;

// Track connected SSE clients
const clients = new Set();

router.get("/stream", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",      
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();
  
  if (cache.data) {
    res.write(`data: ${JSON.stringify({ lastUpdated: cache.lastUpdated, data: cache.data })}\n\n`);
  }

  clients.add(res);

  const ping = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => {
    clearInterval(ping);
    clients.delete(res);
  });
});


// Tiny helper to broadcast latest cache to all clients
function broadcast() {
  const payload = JSON.stringify({ lastUpdated: cache.lastUpdated, data: cache.data });
  for (const res of clients) {
    res.write(`data: ${payload}\n\n`);
  }
}