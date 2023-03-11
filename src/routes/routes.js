import { wrap } from "svelte-spa-router/wrap";
import { isUserLoggedIn } from "../stores.js";
import { get } from "svelte/store";

// //UNPROTECTED
// //player routes
import MapView from "./player/MapView.svelte";
import QuestionView from "./player/QuestionView.svelte";
import PlayerStart from "./player/PlayerStart.svelte";
import PlayerCode from "./player/PlayerCode.svelte";

import Home from "./Home.svelte";
//import Name from "./examples/Name.svelte";
//import Wild from "./Wild.svelte";
import NotFound from "./NotFound.svelte";

// //PROTECTED
// //host routes
import Dashboard from "./host/Dashboard.svelte";
import HostLogin from "./host/HostLogin.svelte";
import HostRegister from "./host/HostRegister.svelte";
//host routes
import CurrentGame from "./host/CurrentGame.svelte";
import GameHistory from "./host/GameHistory.svelte";
import MyCodes from "./host/create/MyCodes.svelte";
import MyGames from "./host/MyGames.svelte";
//host game creation routes
import GameMap from "./host/create/GameMap.svelte";
import GamePlan from "./host/create/GamePlan.svelte";
import GameQuiz from "./host/create/GameQuiz.svelte";

// Export the route definition object
export default {
  // Exact path
  "/": Home,

  //outer host routes
  "/host-login": HostLogin,
  "/host-register": HostRegister,

  //TEMP unguarded
  "/host": Dashboard,
  //"/host/*": Dashboard, //If this is enabled all host/* point to Dashboard

  // //outer host routes
  // // // This route has a pre-condition function that lets people in only 50% of times, and a second pre-condition that is always true
  // "/host": wrap({
  //   // The Svelte component used by the route
  //   component: Dashboard,
  //   // Custom data: any JavaScript object
  //   // This is optional and can be omitted
  //   // It can be useful to understand the component who caused the pre-condition failure
  //   userData: {
  //     userLoginState: get(isUserLoggedIn),
  //   },
  //   // List of route pre-conditions
  //   conditions: [
  //     // First pre-condition function
  //     (detail) => {
  //       let boolean = get(isUserLoggedIn);
  //       console.log("isUserLoggedIn at /host WRAP", get(isUserLoggedIn));
  //       return boolean;
  //     },
  //   ],
  // }),

  // // // This route has a pre-condition function that lets people in only 50% of times, and a second pre-condition that is always true
  // "/host/*": wrap({
  //   // The Svelte component used by the route
  //   component: Dashboard,
  //   // Custom data: any JavaScript object
  //   // This is optional and can be omitted
  //   // It can be useful to understand the component who caused the pre-condition failure
  //   userData: {
  //     userLoginState: get(isUserLoggedIn),
  //   },
  //   // List of route pre-conditions
  //   conditions: [
  //     // First pre-condition function
  //     (detail) => {
  //       let boolean = get(isUserLoggedIn);
  //       console.log("isUserLoggedIn at /host WRAP", get(isUserLoggedIn));
  //       return boolean;
  //     },
  //   ],
  // }),

  //START guarded host routes
  "/host/current-game": CurrentGame,
  "/host/my-games": MyGames,
  "/host/game-history": GameHistory,
  "/host/my-codes": MyCodes,
  "/game-plan/:id": GamePlan,
  "/game-plan/game-map/:id": GameMap,
  "/game-plan/game-quiz/:id": GameQuiz,

  //player routes
  "/player-code": PlayerCode,
  "/player-start/:id": PlayerStart,
  "/player/map-view/:id": MapView,
  "/player/question-view": QuestionView,

  //THESE ARE EXAMPLES BELOW
  // Using named parameters, with last being optional
  //"/hello/:first/:last?": Name,

  // Wildcard parameter
  // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
  //"/wild": Wild,
  //"/wild/*": Wild,

  // Catch-all, must be last
  "*": NotFound,
};
