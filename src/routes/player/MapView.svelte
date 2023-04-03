<script>
  // @ts-nocheck

  import { Buffer } from "buffer";
  import { Html5Qrcode } from "html5-qrcode";
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { player, playerStats } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentPlayers } from "../../stores.js";
  import { currentGamePlanMarkers } from "../../stores.js";
  import { waitingRoomStatus } from "../../stores.js";
  import GamePlanGet from "../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../lib/utilities/GamePlanMarkersGet.svelte";
  import { socket } from "../../socket.js";
  export let params = {};

  let gamePlanGetter;
  let gamePlanMarkerGetter;
  let gameMap;
  let base64String;
  let error;
  //let markerColor;
  let currentPlayerPosition = "0/0";

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
      //ENABLE THIS TO ALLOWE ANSWERING JUST ONCE
      $currentGamePlanMarkers.forEach((element) => {
        // if (
        //   element.content.qrcode.qrCodeTitle === decodedText &&
        //   //the next line checks if the player has answered the question already
        //   !$playerStats.markersFound.includes(element._id)
        // ) {
        //   markerId = element._id;
        //   console.log("markerId ", markerId);
        // } else if ($playerStats.markersFound.includes(element._id)) {
        //   console.log("answered already");
        // }
        if (element.content.qrcode.qrCodeTitle === decodedText) {
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

  async function getMap() {
    const response = await fetch(
      `${baseURL}/game-plan/map/${$currentGame.gamePlan._id}`
    );
    gameMap = await response.json();
    base64String = Buffer.from(gameMap.file.data).toString("base64");
  }

  async function getGameInfo() {
    try {
      const response = await fetch(`${baseURL}/game/info/${params.id}`);
      const responseData = await response.json();
      $currentGame = responseData.currentGame;
      if (responseData.currentGame) {
        console.log("$currentGame loaded", $currentGame);
        console.log("$currentGame.gameStatus", $currentGame.gameStatus);
        console.log("$currentGame.gamePlan._id", $currentGame.gamePlan._id);
      } else {
        error = responseData.error;
        $currentGame.gameStatus = "";
        console.warn(error);
        localStorage.clear();
        push("/player-code");
      }
      await getMap();
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function getPlayers() {
    try {
      const response = await fetch(`${baseURL}/game/players/${params.id}`);
      let playersData = await response.json();
      $currentPlayers = playersData.players;
      console.log("$currentPlayers ", $currentPlayers);

      function findByKey(key, value) {
        return (item, i) => item[key] === value;
      }
      let findParams = findByKey("_id", $playerStats._id);
      currentPlayerPosition = `${$currentPlayers.findIndex(findParams) + 1}/${
        $currentPlayers.length
      }`;

      console.log("currentPlayerPosition ", currentPlayerPosition);
      console.log("$playerStats._id ", $playerStats._id);
    } catch (error) {
      console.log({ error: error });
    }
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

  socket.onmessage = function (event) {
    console.log(`WS Data received from server: ${event.data}`);
    const receivedData = JSON.parse(event.data);
    console.log("receivedData parsed", receivedData);
    if (receivedData.event === "gameStarted") {
      $currentGame.gameStatus = "started";
      getGameInfo();
    } else if (receivedData.event === "gameEnded") {
      $playerStats = receivedData.finalScores;
      $waitingRoomStatus = "afterGame";
      console.log("$waitingRoomStatus MapView ", $waitingRoomStatus);
      replace(`/waiting-room/${params.id}`);
    } else if (receivedData.event === "scoreUpdate") {
      getPlayers();
    } else {
      console.log("receivedData ", receivedData);
    }
  };

  function markerColor(isVisited) {
    return isVisited ? "grey" : "green";
  }

  onMount(async () => {
    await getGameInfo(); //loads map
    await gamePlanGetter.getGamePlan($currentGame.gamePlan._id);
    await gamePlanMarkerGetter.getGamePlanMarkers($currentGame.gamePlan._id);
    await getPlayerStats();
    $currentGame.gameStatus = "activated";
    await getPlayers();
    init();
  });
</script>

<div class="column-container" in:fade={{ duration: 1000 }}>
  {#if !scanning}
    <h2>Mängu kaart</h2>
    {#if $playerStats}
      <div>
        <span>
          Koht: {currentPlayerPosition}
        </span>
        <span>
          Punkte: {$playerStats.pointsTotal}
        </span>
      </div>
      <br />
    {/if}
  {/if}
  <div class="map-row-container">
    {#if !scanning && $waitingRoomStatus !== "afterGame"}
      <div class="map-box">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="map-inner-box">
          {#if gameMap}
            <img
              src={`data:image/png;base64,${base64String}`}
              alt={gameMap.filename}
            />
          {/if}
          {#each Object.entries($currentGamePlanMarkers) as [key, value]}
            <div
              class="image-marker {markerColor(
                $playerStats.markersFound.includes(value._id)
              )}"
              id={value._id}
              style="top: {value.content.position.y - 20}px; left: {value
                .content.position.x - 20}px;"
            >
              {value.title}
            </div>
          {/each}
        </div>
      </div>

      <div class="info-box">
        <h4>
          Kasuta kaarti, et leida asukoht, kus asub QR kood. Seda skaneerides
          saad vastata kusimusele.
        </h4>
      </div>
    {/if}

    <div class="reader-box">
      <reader id="reader" />
      {#if scanning}
        {#if scanStatus}
          <h3 class="warning" in:fade={{ duration: 500 }}>{scanStatus}</h3>
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
  }
  .map-inner-box {
    min-width: 100%;
    min-height: 100%;
    position: relative;
    border: none;
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
    opacity: 0.8;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grey {
    color: grey;
    border: 3px solid grey;
    background-color: rgb(210, 210, 210);
  }

  .green {
    color: green;
    border: 3px solid green;
    background-color: rgb(142, 200, 142);
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
