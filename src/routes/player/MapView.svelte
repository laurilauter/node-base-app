<script>
  // @ts-nocheck
  import { Html5Qrcode } from "html5-qrcode";
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { player, playerStats } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentGamePlan } from "../../stores.js";
  import { currentGamePlanMarkers } from "../../stores.js";
  import GamePlanGet from "../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../lib/utilities/GamePlanMarkersGet.svelte";
  export let params = {};

  let gamePlanGetter;
  let gamePlanMarkerGetter;
  let error;

  //QR scanner
  let scanning = false;
  let html5Qrcode;
  let decodedText;
  let decodedResult;
  let scanStatus;

  function init() {
    html5Qrcode = new Html5Qrcode("reader");
  }

  function start() {
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    );
    scanning = true;
  }

  async function stop() {
    await html5Qrcode.stop();
    scanning = false;
  }

  function onScanSuccess(decodedText, decodedResult) {
    console.log("decodedResult ", decodedResult);
    console.log("decodedText", decodedText);
    if (decodedText) {
      let markerId;
      $currentGamePlanMarkers.forEach((element) => {
        if (
          element.content.qrcode.qrCodeTitle === decodedText &&
          //the next line checks if the player has answered the question already
          !$playerStats.markersFound.includes(element._id)
        ) {
          markerId = element._id;
          console.log("markerId ", markerId);
        } else if ($playerStats.markersFound.includes(element._id)) {
          console.log("answered already");
        }
      });
      if (markerId) {
        push(`/player/question-view/${params.id}/${markerId}`);
      }
    } else {
      console.log("Unknown code");
    }
    stop();
  }

  function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
  }
  //scanner end

  async function getGameInfo() {
    try {
      const response = await fetch(`${baseURL}/game/info/${params.id}`);
      const responseData = await response.json();
      $currentGame = responseData.currentGame;
      if (responseData.currentGame) {
        console.log("$currentGame loaded", $currentGame);
      } else {
        error = responseData.error;
        console.warn(error);
        localStorage.clear();
        push("/player-code");
      }
    } catch (error) {
      console.log({ error: error });
    }
  }

  function getLocalPlayerInfo() {
    $player = {
      _id: JSON.parse(localStorage.getItem("playerId")),
      playerName: JSON.parse(localStorage.getItem("playerName")),
      gameCode: JSON.parse(localStorage.getItem("gameId")),
    };
  }

  async function getPlayerStats() {
    try {
      const response = await fetch(`${baseURL}/game/player/${$player._id}`);
      const responseData = await response.json();
      $playerStats = responseData.player;
      if (responseData.player) {
        console.log("$playerStats loaded", $playerStats);
      } else {
        error = responseData.error;
      }
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    await getGameInfo();
    await gamePlanGetter.getGamePlan($currentGame.gamePlan._id);
    await gamePlanMarkerGetter.getGamePlanMarkers($currentGame.gamePlan._id);
    getLocalPlayerInfo();
    console.log("$player._id ", $player._id);
    await getPlayerStats();
    init();
  });
</script>

<div class="column-container" in:fade={{ duration: 1000 }}>
  {#if !scanning}
    <!-- <h4>
      <span> Aega 00:43:21 </span>
      <span> Koht 2/8 </span>
    </h4>
    <h4>
      <span> Punkte 9 </span>
      <span> Vastatud 0/3 </span>
    </h4> -->
    <h2>Mängu kaart</h2>
  {/if}
  <div class="map-row-container">
    {#if !scanning}
      <div class="map-box">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="map-inner-box">
          {#if $currentGamePlan.gameMap}
            <img src="{baseURL}/uploads/{$currentGamePlan.gameMap}" alt="map" />
          {/if}
          {#each Object.entries($currentGamePlanMarkers) as [key, value]}
            <div
              class="image-marker"
              style="top: {value.content.position.y - 20}px; left: {value
                .content.position.x - 20}px;"
            >
              {value.title}
            </div>
          {/each}
        </div>
      </div>

      <div class="info-box">
        <!-- <p>{$currentGamePlan.gameMap}</p> -->
        <h4>
          Kasuta kaarti, er leida asukoht looduses/hoones. Sealt leiad QR koodi.
          Seda skannides saad vastata kusimustele.
        </h4>
      </div>
    {/if}

    <div class="reader-box">
      <reader id="reader" />
      {#if scanning}
        {#if scanStatus}
          <h3 class="warning" n:fade={{ duration: 500 }}>{scanStatus}</h3>
        {/if}
        <button on:click={stop}>Stop</button>
        <span>
          {decodedText}
          {decodedResult}
        </span>
      {:else}
        <button on:click={start}>Skaneeri</button>
      {/if}
    </div>
  </div>
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

  .map-row-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
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
    max-width: 360px;
  }

  /* SCANNER STYLE */
  .reader-box {
    min-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  #reader {
    width: 100%;
    min-height: auto;
    background-color: black;
  }

  .warning {
    color: var(--link-hover-color);
  }
</style>
