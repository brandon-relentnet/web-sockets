import express from "express";
import { ADMIN_TOKEN } from "./config.js";
import { currentMatchId, setCurrentMatchId, cache } from "./state.js";
import { fetchSnapshot, fetchStaticContext } from "./ncpaApi.js";
import { startSocket, stopSocket } from "./socket.js";
import { broadcast, addClient } from "./sse.js";
import { cleanFromNcpa } from "./normalize.js";

const router = express.Router();

async function setMatch(matchId){
  if(!Number.isFinite(matchId)) throw new Error("Invalid match_id");
  if(matchId === currentMatchId && cache.data) return;
  setCurrentMatchId(matchId);
  try { await fetchStaticContext(matchId); } catch {}
  await fetchSnapshot(matchId);
  startSocket(matchId);
  broadcast();
}

// SSE
router.get("/", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  if (!cache.data) {
    try { await fetchStaticContext(currentMatchId); } catch {}
    try { await fetchSnapshot(currentMatchId); } catch {}
  }

  // initial write
  const firstClean = cleanFromNcpa(cache.data);
  res.write(`data: ${JSON.stringify({ matchId: currentMatchId, lastUpdated: cache.lastUpdated, data: firstClean })}\n\n`);

  const cleanup = addClient(res);
  req.on("close", cleanup);
});

// Switch match
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

// Optional debug
router.get("/context", (req, res) => {
  // You can pull from ctxByMatch if you want; shown minimal here
  res.json({ matchId: currentMatchId });
});

// Bootstrap
(async () => {
  try { await fetchStaticContext(currentMatchId); } catch {}
  try { await fetchSnapshot(currentMatchId); } catch {}
  startSocket(currentMatchId);
})();

export default router;
