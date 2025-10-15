import { clients, cache, currentMatchId } from "./state.js";
import { cleanFromNcpa } from "./normalize.js";

export function broadcast(){
  const cleaned = cleanFromNcpa(cache.data);
  const payload = `data: ${JSON.stringify({ matchId: currentMatchId, lastUpdated: cache.lastUpdated, data: cleaned })}\n\n`;
  for (const res of clients) res.write(payload);
}

export function addClient(res){
  clients.add(res);
  const ping = setInterval(() => res.write(": ping\n\n"), 15000);
  return () => { clearInterval(ping); clients.delete(res); };
}
