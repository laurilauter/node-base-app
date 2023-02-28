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
  _id: "gamePlan._id",
  gameTitle: "gamePlan.gameTitle",
  gameMap: "gamePlan.gameMap",
  ownerId: "gamePlan.ownerId",
  gameDuration: "gamePlan.gameDuration",
  markers: "gamePlan.markers",
});
//player
export const playerName = writable();
