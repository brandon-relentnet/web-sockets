import { API_URL, API_KEY, defaultCtx } from "./config.js";
import { cache, ctxByMatch } from "./state.js";

export async function fetchSnapshot(matchId) {
  const res = await fetch(
    `${API_URL}/api/get-games/?key=${encodeURIComponent(API_KEY)}&match_id=${encodeURIComponent(matchId)}`
  );
  cache.data = await res.json(); // { success, info: {...} }
  cache.lastUpdated = new Date().toISOString();
}

const cleanName = (m) => `${(m.first_name||"").trim()} ${(m.last_name||"").trim()}`.trim();
const toPair = (arr=[]) => {
  const n = arr.map(cleanName).filter(Boolean);
  return /** @type {[string,string]} */([n[0]||"Player 1", n[1]||"Player 2"]);
};

export async function fetchStaticContext(matchId) {
  const url = `${API_URL}/api/get-match?key=${encodeURIComponent(API_KEY)}&match_id=${encodeURIComponent(matchId)}`;
  const res = await fetch(url);
  const json = await res.json();
  const mi = json?.match_info || {};

  const t1 = mi.t1 || {};
  const t2 = mi.t2 || {};

  const team1Name  = t1.team_name || t1.university_name || defaultCtx.team1Name;
  const team2Name  = t2.team_name || t2.university_name || defaultCtx.team2Name;
  const team1Logo  = t1.university_picture || defaultCtx.team1Logo;
  const team2Logo  = t2.university_picture || defaultCtx.team2Logo;

  const team1Players = toPair(t1.team_members);
  const team2Players = toPair(t2.team_members);

  const associationName = "NCPA";
  const eventName = [mi.tournament] || defaultCtx.eventName;
  const eventPhase = String(mi.bracket_status || defaultCtx.eventPhase).replace(/\s+In Progress$/i, "").trim();

  const derived = { associationName, eventName, eventPhase, team1Name, team2Name, team1Logo, team2Logo, team1Players, team2Players };
  ctxByMatch.set(matchId, derived);
  return derived;
}
