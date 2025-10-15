export const API_URL  = (process.env.API_URL || "https://tournaments.ncpaofficial.com").replace(/\/$/, "");
export const API_KEY  = process.env.API_KEY || "password";
export const DEFAULT_MATCH_ID = Number(process.env.MATCH_ID || 8859);
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

export const defaultCtx = {
  associationName: "NCPA",
  eventName: "Event",
  eventPhase: "Pool Play",
  team1Name: "Team 1",
  team2Name: "Team 2",
  team1Logo: "/logos/team1.png",
  team2Logo: "/logos/team2.png",
  team1Players: /** @type {[string,string]} */(["Player 1","Player 2"]),
  team2Players: /** @type {[string,string]} */(["Player 1","Player 2"]),
};
