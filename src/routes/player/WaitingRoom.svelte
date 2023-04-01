<script>
  import { Html5Qrcode } from "html5-qrcode";
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { player, playerStats } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentPlayers } from "../../stores.js";
  import GamePlanGet from "../../lib/utilities/GamePlanGet.svelte";
  import { socket } from "../../socket.js";
  export let params = {};

  let gamePlanGetter;
  let error;
  let data;

  function sendData(data) {
    socket.send(JSON.stringify(data));
  }

  async function getPlayers() {
    try {
      const response = await fetch(`${baseURL}/game/players/${params.id}`);
      let playersData = await response.json();
      $currentPlayers = playersData.players;
      console.log("$currentPlayers ", $currentPlayers);
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

  socket.onmessage = function (event) {
    console.log(`WS Data received from server: ${event.data}`);
    const receivedData = JSON.parse(event.data);
    console.log("receivedData parsed", receivedData);
    if (receivedData.event === "gameStarted") {
      $currentGame.gameStatus = "started";
      push(`/player/map-view/${params.id}`);
    } else if (receivedData.event === "gameEnded") {
      $currentGame.gameStatus = "";
      localStorage.clear();
      replace("/player-code");
    } else if (receivedData.event === "playerJoined") {
      getPlayers();
    } else {
      console.log("receivedData ", receivedData);
    }
  };

  data = { event: "playerJoined" };
  sendData(data);

  onMount(async () => {
    $currentGame.gameStatus = "activated";
    await gamePlanGetter.getGamePlan($currentGame.gamePlan._id);
    getLocalPlayerInfo();
    await getPlayerStats();
    await getPlayers();
  });
</script>

<div class="column-container" in:fade={{ duration: 1000 }}>
  <h2>Ooteruum</h2>
  {#if $currentGame.gameStatus === "activated" || $currentGame.gameStatus === "started"}
    <div>
      <h2>Mängijad</h2>
      <div class="players-frame column-container">
        {#if $currentPlayers}
          {#each $currentPlayers as player}
            <div class="player">
              <span>{$currentPlayers.indexOf(player) + 1}.</span>
              <span class="bold">
                {player.name}
              </span>
              <span />
              <span>
                Punkte: {player.pointsTotal}
              </span>
              <!-- <span>EEMALDA</span> -->
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<GamePlanGet bind:this={gamePlanGetter} />

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
