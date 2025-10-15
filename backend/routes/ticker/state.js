import { DEFAULT_MATCH_ID } from "./config.js";

export let currentMatchId = DEFAULT_MATCH_ID;
export function setCurrentMatchId(id) { currentMatchId = id; }

export const cache = { data: null, lastUpdated: null };
export const ctxByMatch = new Map();    // matchId -> derived static context
export const clients = new Set();       // SSE clients
