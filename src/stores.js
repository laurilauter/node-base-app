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
  gameDuration: "",
  markers: "",
});
export const currentGamePlanMarkers = writable([]);
//player
export const playerName = writable();
