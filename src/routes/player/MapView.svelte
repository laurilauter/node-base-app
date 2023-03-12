<script>
  // @ts-nocheck
  import baseURL from "../../lib/utilities/baseUrl";
  import Navigation from "svelte-material-icons/Navigation.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { currentGame } from "../../stores.js";
  import { currentGamePlan } from "../../stores.js";
  import { currentGamePlanMarkers } from "../../stores.js";
  import GamePlanGet from "../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../lib/utilities/GamePlanMarkersGet.svelte";
  export let params = {};

  let gamePlanGetter;
  let gamePlanMarkerGetter;
  let error;

  let direction;
  function handleDirection(event) {
    direction = event.alpha;
  }

  async function getGameInfo() {
    try {
      const response = await fetch(`${baseURL}/game/info/${params.id}`);
      const responseData = await response.json();
      $currentGame = responseData.currentGame;
      console.log("$currentGame", $currentGame);
      error = responseData.error;
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    await getGameInfo();

    await gamePlanGetter.getGamePlan($currentGame.gamePlan._id);
    await gamePlanMarkerGetter.getGamePlanMarkers($currentGame.gamePlan._id);
  });
</script>

<div on:deviceorientation={handleDirection}>
  <span>Device direction:</span>
  <span>{direction}</span>
  <span>
    <Navigation
      size={"2rem"}
      ariaHidden={false}
      rotate={direction}
      color={"#ff0000"}
    />
  </span>
</div>

<div class="column-container" in:fade={{ duration: 1000 }}>
  <!-- {statusCode} -->
  <div class="row-container">
    <h2>Mängu kaart</h2>
  </div>
  <div class="map-row-container">
    <div class="map-box">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="map-inner-box">
        <img src="{baseURL}/uploads/{$currentGamePlan.gameMap}" alt="map" />
        {#each Object.entries($currentGamePlanMarkers) as [key, value]}
          <div
            class="image-marker"
            style="top: {value.content.position.y - 20}px; left: {value.content
              .position.x - 20}px;"
          >
            {value.title}
          </div>
        {/each}
      </div>
    </div>
    <div class="info-box">
      <h4>
        Kasuta kaarti, er leida asukoht looduses. Sealt leiad QR koodi. Seda
        skannides saad vastata kusimustele.
      </h4>
      <button>SKANEERI</button>

      <p>{$currentGamePlan.gameMap}</p>
    </div>
  </div>
</div>

<div>
  <p>
    1. First this should display some spinner indicating that players are
    gathering
  </p>
  <p>2. Game will start when the game leader starts it</p>
  <p>3. Game ends when the game leader ends it, or game time is up.</p>
  <p>
    4. Alternatively the player can leave leave and come back with the same game
    code to continue.
  </p>
</div>

<GamePlanGet bind:this={gamePlanGetter} />
<GamePlanMarkersGet bind:this={gamePlanMarkerGetter} />

<style>
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 9px;
    /* border: 1px solid green; */
  }

  .map-box {
    margin: 0px;
    border: none;
    width: 360px;
    height: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    /* border: 1px solid blue; */
  }
  .map-inner-box {
    min-width: 100%;
    min-height: 100%;
    position: relative;
    border: none;
    /* border: 1px solid yellow; */
  }

  .map-inner-box > p {
    color: black;
    top: -15px;
    left: 20px;
    position: absolute;
  }

  .map-row-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    align-items: top;
  }

  .image-marker {
    position: absolute;
    color: green;
    border: 3px solid green;
    background-color: rgb(142, 200, 142);
    opacity: 0.8;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-box {
    margin: 0px;
    /* border: 1px solid var(--main-color); */
    border-radius: 9px;
    max-width: 560px;
    height: auto;
    padding: 10px;
  }
</style>
