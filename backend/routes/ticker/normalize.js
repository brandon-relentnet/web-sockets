import { defaultCtx } from "./config.js";
import { ctxByMatch, currentMatchId } from "./state.js";

function nameFromTeamMember(m){ if(!m) return ""; return `${(m.first_name||"").trim()} ${(m.last_name||"").trim()}`.trim(); }

function playersTupleFromSeries(games, currentIdx, key, fallbackPair) {
  const names=[]; const push=(n)=>{const s=(n||"").trim(); if(s && !names.includes(s)) names.push(s);};
  for (const p of (games[currentIdx]?.[key] || [])) push(nameFromTeamMember(p));
  for (let i=currentIdx-1; names.length<2 && i>=0; i--) for (const p of (games[i]?.[key]||[])) { if(names.length>=2) break; push(nameFromTeamMember(p)); }
  for (let i=currentIdx+1; names.length<2 && i<games.length; i++) for (const p of (games[i]?.[key]||[])) { if(names.length>=2) break; push(nameFromTeamMember(p)); }
  if (names.length<2 && Array.isArray(fallbackPair)) for (const n of fallbackPair){ if(names.length>=2) break; push(n); }
  while (names.length<2) names.push(`Player ${names.length+1}`);
  return /** @type {[string,string]} */([names[0], names[1]]);
}

export function selectCurrentGameIndex(info){
  const games=Array.isArray(info?.games)?info.games:[]; const n=games.length; if(n===0) return 0;
  const cg=Number(info?.current_game);
  const lastCompleted=(()=>{for(let i=n-1;i>=0;i--){if(games[i]?.winner!=null) return i;}return -1;})();
  const lastWithScore=(()=>{for(let i=n-1;i>=0;i--){const g=games[i]; if(g?.t1score!=null||g?.t2score!=null) return i;}return -1;})();
  if(Number.isFinite(cg) && cg===-1) return (lastCompleted>=0?lastCompleted:(lastWithScore>=0?lastWithScore:0));
  if(Number.isFinite(cg)){ if(cg>=0 && cg<n) return cg; if(cg>=1 && cg<=n) return cg-1; }
  if(lastCompleted>=0) return lastCompleted; if(lastWithScore>=0) return lastWithScore; return 0;
}

const formatRules = (t,m)=>`First to ${Number.isFinite(t)?t:11}, win by ${Number.isFinite(m)?m:2}`;
const seriesStatus=(t1,t2,w1,w2)=>{const a=Number.isFinite(w1)?w1:0,b=Number.isFinite(w2)?w2:0; if(a===b) return `Series tied ${a}–${b}`; return a>b?`Team 1 (${t1}) leads ${a}–${b}`:`Team 2 (${t2}) leads ${b}–${a}`;};

export function cleanFromNcpa(raw, ctxOverride = {}) {
  const ctxBase = ctxByMatch.get(currentMatchId) || defaultCtx;
  const C = { ...ctxBase, ...ctxOverride };

  const info = raw?.info || raw || {};
  const games = Array.isArray(info.games) ? info.games : [];
  const gameIdx = selectCurrentGameIndex(info);
  const g = games[gameIdx] || {};

  const t1score = Number.isFinite(g.t1score) ? g.t1score : 0;
  const t2score = Number.isFinite(g.t2score) ? g.t2score : 0;

  const t1Players = playersTupleFromSeries(games, gameIdx, "t1_players", C.team1Players);
  const t2Players = playersTupleFromSeries(games, gameIdx, "t2_players", C.team2Players);

  return {
    associationName: C.associationName,
    eventName: C.eventName,
    eventPhase: C.eventPhase,
    eventFormat: formatRules(info.target_score, info.win_margin),
    team1: { name: C.team1Name, players: t1Players, logoUrl: C.team1Logo, score: t1score },
    team2: { name: C.team2Name, players: t2Players, logoUrl: C.team2Logo, score: t2score },
    matchStatus: seriesStatus(C.team1Name, C.team2Name, info.t1_wins, info.t2_wins),
    currentGame: Number.isFinite(info.current_game) ? info.current_game : gameIdx + 1,
  };
}
