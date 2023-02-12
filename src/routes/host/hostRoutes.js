import { wrap } from "svelte-spa-router/wrap";
import { isLoggedIn } from "../../stores.js";
import { get } from "svelte/store";

//import NotFound from "./NotFound.svelte";

//host routes
import CurrentGame from "./CurrentGame.svelte";
import GameHistory from "./GameHistory.svelte";
import MyCodes from "./create/MyCodes.svelte";
import MyGames from "./MyGames.svelte";
//host game creation routes
import GameMap from "./create/GameMap.svelte";
import GamePlan from "./create/GamePlan.svelte";
import GameQuiz from "./create/GameQuiz.svelte";

// Export the route definition object
export default {
  //outer host routes
  //START guarded host routes
  "/dashboard/current-game": CurrentGame,
  "/dashboard/my-games": MyGames,
  "/dashboard/game-history": GameHistory,
  //host game creation
  "/dashboard/game/my-codes": MyCodes,
  "/dashboard/game/game-map": GameMap,
  "/dashboard/game/game-plan": GamePlan,
  "/dashboard/game/game-quiz": GameQuiz,
  //END guarded host routes

  // Catch-all, must be last
  //"*": NotFound,
};
