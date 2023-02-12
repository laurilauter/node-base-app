import Home from "./Home.svelte";
import Name from "./Name.svelte";
import Wild from "./Wild.svelte";
import NotFound from "./NotFound.svelte";
//host routes
import CurrentGame from "./host/CurrentGame.svelte";
import GameHistory from "./host/GameHistory.svelte";
import MyCodes from "./host/create/MyCodes.svelte";
import MyGames from "./host/MyGames.svelte";
//player routes
import MapView from "./player/MapView.svelte";
import QuestionView from "./player/QuestionView.svelte";
import Start from "./player/Start.svelte";
import GameMap from "./host/create/GameMap.svelte";
import GamePlan from "./host/create/GamePlan.svelte";
import GameQuiz from "./host/create/GameQuiz.svelte";
import Dashboard from "./host/Dashboard.svelte";

// Export the route definition object
export default {
  // Exact path
  "/": Home,

  //host routes
  "/dashboard": Dashboard,
  "/current-game": CurrentGame,
  "/my-games": MyGames,
  "/game-history": GameHistory,
  //host game creation
  "/my-codes": MyCodes,
  "/game-map": GameMap,
  "/game-plan": GamePlan,
  "/game-quiz": GameQuiz,

  //player routes
  "/start:id": Start,
  "/map-view": MapView,
  "/question-view": QuestionView,

  // Using named parameters, with last being optional
  "/hello/:first/:last?": Name,

  // Wildcard parameter
  // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
  "/wild": Wild,
  "/wild/*": Wild,

  // Catch-all, must be last
  "*": NotFound,
};
