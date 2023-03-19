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
export const userQrCodes = writable([]);
//Game
export const currentJoinLink = writable();
export const currentGame = writable({
  _id: "",
  gamePlan: {
    _id: "",
  },
  gameStatus: "",
  gameCode: "",
  players: [],
});
export const currentPlayers = writable([]);

//player
export const player = writable({
  _id: "",
  playerName: "",
  gameCode: "",
});
export const playerStats = writable();
export const currentGamePlanMarker = writable({
  title: "",
  gamePlanId: "",
  content: {
    position: {
      x: 0,
      y: 0,
    },
    qrcode: "",
    quiz: {
      question: "",
      answers: [
        {
          text: "",
          isCorrect: false,
        },
      ],
    },
  },
});
