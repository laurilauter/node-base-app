import { wrap } from "svelte-spa-router/wrap";
import { isLoggedIn } from "../stores.js";
import { get } from "svelte/store";

import Home from "./Home.svelte";
import Name from "./Name.svelte";
import Wild from "./Wild.svelte";
import NotFound from "./NotFound.svelte";
//host routes
import Dashboard from "./Dashboard.svelte";

//host routes
import CurrentGame from "./host/CurrentGame.svelte";
import GameHistory from "./host/GameHistory.svelte";
import MyCodes from "./host/create/MyCodes.svelte";
import MyGames from "./host/MyGames.svelte";
//host game creation routes
import GameMap from "./host/create/GameMap.svelte";
import GamePlan from "./host/create/GamePlan.svelte";
import GameQuiz from "./host/create/GameQuiz.svelte";

//player routes
import MapView from "./player/MapView.svelte";
import QuestionView from "./player/QuestionView.svelte";
import Start from "./player/Start.svelte";

// Export the route definition object
export default {
  // Exact path
  "/": Home,

  //outer host routes
  //"/dashboard": Dashboard,

  // This route has a pre-condition function that lets people in only 50% of times, and a second pre-condition that is always true
  "/dashboard": wrap({
    // The Svelte component used by the route
    component: Dashboard,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  //START guarded host routes
  "/current-game": wrap({
    // The Svelte component used by the route
    component: CurrentGame,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  "/my-games": wrap({
    // The Svelte component used by the route
    component: MyGames,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  "/game-history": wrap({
    // The Svelte component used by the route
    component: GameHistory,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  //host game creation
  "/game/my-codes": wrap({
    // The Svelte component used by the route
    component: MyCodes,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  "/game/game-map": wrap({
    // The Svelte component used by the route
    component: GameMap,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  "/game/game-plan": wrap({
    // The Svelte component used by the route
    component: GamePlan,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  "/game/game-quiz": wrap({
    // The Svelte component used by the route
    component: GameQuiz,
    // List of route pre-conditions
    conditions: [
      // First pre-condition function
      (detail) => {
        let boolean = get(isLoggedIn);
        return boolean;
      },
    ],
  }),

  //player routes
  "/start/:id": Start,
  "/map-view": MapView,
  "/question-view": QuestionView,

  //THESE ARE EXAMPLES BELOW
  // Using named parameters, with last being optional
  "/hello/:first/:last?": Name,

  // Wildcard parameter
  // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
  "/wild": Wild,
  "/wild/*": Wild,

  // Catch-all, must be last
  "*": NotFound,
};
