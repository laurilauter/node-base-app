<script>
  import { baseURL } from "./baseUrl";
  import { currentGamePlanMarker } from "../../stores.js";

  export async function getGamePlanMarkers(id) {
    try {
      const response = await fetch(`${baseURL}/game-plan/marker/${id}`);
      let gamePlanMarker = await response.json();
      $currentGamePlanMarker = gamePlanMarker;
      console.log(
        "$currentGamePlanMarker from UTILITY ",
        $currentGamePlanMarker
      );
    } catch (error) {
      console.log({ error: error });
    }
  }
</script>
