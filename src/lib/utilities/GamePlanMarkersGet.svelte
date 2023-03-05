<script>
  import baseURL from "./baseUrl";
  import { currentGamePlanMarkers } from "../../stores.js";

  export async function getGamePlanMarkers(id) {
    try {
      const response = await fetch(`${baseURL}/game-plan/markers/${id}`);
      let gamePlanMarkers = await response.json();
      $currentGamePlanMarkers = gamePlanMarkers;
      console.log(
        "$currentGamePlanMarkers from COMP ",
        $currentGamePlanMarkers
      );
    } catch (error) {
      console.log({ error: error });
    }
  }
</script>
