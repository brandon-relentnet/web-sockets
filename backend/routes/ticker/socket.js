import { io } from "socket.io-client";
import { API_URL, API_KEY } from "./config.js";
import { cache } from "./state.js";
import { broadcast } from "./sse.js";

let socket = null;
export function stopSocket(){ if(socket){ socket.removeAllListeners(); socket.close(); socket=null; } }

export function startSocket(matchId){
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
