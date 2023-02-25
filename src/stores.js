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
//player
export const playerName = writable();
