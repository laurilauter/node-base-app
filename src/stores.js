import { writable } from "svelte/store";

//session
export const isUserLoggedIn = writable(false);
export const sessionId = writable();
export const sessionUserInfo = writable({
  id: "id",
  email: "email",
  role: "role",
});
//gameplan
export const currentGamePlanLink = writable();
export const currentGamePlan = writable({
  _id: "",
  gameTitle: "",
  gameMap: "",
  ownerId: "",
  markers: "",
});
export const currentGamePlanMarkers = writable([]);
//Game
export const currentJoinLink = writable();
export const currentGame = writable({
  _id: "",
  gameStatus: "none",
  gameCode: "",
  players: [],
});
export const currentPlayers = writable([]);

//player
export const playerName = writable();
