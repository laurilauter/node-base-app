import { writable } from "svelte/store";

export const isLoggedIn = writable(false);
console.log("isLoggedIn at STORES ", isLoggedIn);
export const currentGamePlan = writable({});
