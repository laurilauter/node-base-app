<script>
  import GamePlan from "./create/GamePlan.svelte";
  import baseURL from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let archGame;
  export let params = {};

  async function getGame() {
    const response = await fetch(`${baseURL}/archive/${params.id}`);
    let archivedGame = await response.json();
    archGame = {
      _id: archivedGame._id,
      gamePlan: archivedGame.gamePlan,
      gameCode: archivedGame.gameCode,
      gameStartTime: archivedGame.gameStartTime,
      gameEndTime: archivedGame.gameEndTime,
      playersStats: archivedGame.playersStats,
    };
    console.log("archivedGame ", archivedGame);
    console.log("archGame ", archGame);
  }

  onMount(async () => {
    getGame();
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <div>
    {#if archGame}
      <h1>{archGame.gamePlan.gameTitle}</h1>
      <h2>{archGame.gameCode}</h2>
      <!-- <p>{archGame._id}</p> -->
      <p><span class="bold">Algus: </span>{archGame.gameStartTime}</p>
      <p><span class="bold">Lõpp: </span>{archGame.gameEndTime}</p>

      {#each archGame.playersStats as player}
        <div class="player-row">
          <span class="bold">{player.name}</span>
          <span>Punkte: {player.pointsTotal}</span>
          <span>Märke: {player.markersFound}</span>
        </div>
      {/each}
    {:else}
      <Loader />
    {/if}
  </div>
</div>

<style>
  .bold {
    font-weight: bold;
  }

  .player-row {
    margin: 10px;
  }
</style>
