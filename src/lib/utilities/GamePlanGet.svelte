<script>
  import { baseURL } from "./baseUrl";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlanLink } from "../../stores.js";
  import { currentGamePlan } from "../../stores.js";

  const currentLink = "#/game-plan/" + $location.slice(-24);
  console.log("currentLink ", currentLink);
  export async function getGamePlan(id) {
    try {
      const response = await fetch(`${baseURL}/game-plan/${id}`);
      let gamePlan = await response.json();
      $currentGamePlanLink = {
        location: currentLink,
        title: gamePlan.gameTitle,
      };
      $currentGamePlan = {
        _id: gamePlan._id,
        gameTitle: gamePlan.gameTitle,
        gameMap: gamePlan.gameMap,
        ownerId: gamePlan.ownerId,
        markers: gamePlan.markers,
      };
      console.log("$currentGamePlan from UTILITY ", $currentGamePlan);
    } catch (error) {
      console.log({ error: error });
    }
  }
</script>
