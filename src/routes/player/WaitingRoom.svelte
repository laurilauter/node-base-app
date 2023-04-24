<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { player, playerStats } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentPlayers } from "../../stores.js";
  import { waitingRoomStatus } from "../../stores.js";
  import GamePlanGet from "../../lib/utilities/GamePlanGet.svelte";
  import { socket } from "../../socket.js";
  export let params = {};

  let gamePlanGetter;
  let error;

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
      }
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
    //console.log(`WS Data received from server: ${event.data}`);
    const receivedData = JSON.parse(event.data);
    console.log("receivedData parsed", receivedData);
    if (receivedData.event === "gameStarted") {
      $currentGame.gameStatus = "started";
      replace(`/player/map-view/${params.id}`);
    } else if (receivedData.event === "playerJoined") {
      getPlayers();
    } else {
      console.log("receivedData ", receivedData);
    }
  };

  function exitGame() {
    try {
      $currentGame.gameStatus = "";
      localStorage.clear();
      $player = {
        _id: "",
        playerName: "",
        gameCode: "",
      };
      replace("/player-code");
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    if ($waitingRoomStatus === "beforeGame") {
      await getGameInfo();
      await gamePlanGetter.getGamePlan($currentGame.gamePlan._id);
      await getPlayers();
      await getPlayerStats();
      console.log("$currentGame.gamePlan._id ", $currentGame.gamePlan._id);
    }
  });
</script>

<div class="column-container" in:fade={{ duration: 1000 }}>
  {#if $waitingRoomStatus === "beforeGame"}
    <h2>Ooteruum</h2>
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
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {:else if $waitingRoomStatus === "afterGame"}
    <h2>Mäng läbi</h2>
    <div>
      <h2>Järjestus</h2>
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
            </div>
          {/each}
        {/if}
      </div>
      <button class="btn" on:click={exitGame}>Välju</button>
    </div>
  {/if}
</div>

<GamePlanGet bind:this={gamePlanGetter} />

<style>
  .bold {
    font-weight: bold;
  }
</style>
