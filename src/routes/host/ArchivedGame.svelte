<script>
  import { push, pop, replace, location } from "svelte-spa-router";
  import baseURL from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";

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

  async function deleteGame() {
    const response = await fetch(`${baseURL}/archive/delete/${params.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    //console.log("deletedGame ", deletedGame.message);
    replace("/host/game-history");
  }

  onMount(async () => {
    getGame();
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <div>
    {#if archGame}
      <h1>{archGame.gamePlan.gameTitle}</h1>
      <div class="title-row">
        <h2>{archGame.gameCode}</h2>
        <span class="link-button" on:click={deleteGame} on:keypress>
          <TrashCanOutline size={"2rem"} ariaHidden={false} />
        </span>
      </div>
      <!-- <p>{archGame._id}</p> -->
      <p><span class="bold">Algus: </span>{archGame.gameStartTime}</p>
      <p><span class="bold">Lõpp: </span>{archGame.gameEndTime}</p>
      <span class="bold">Mängijad</span>

      {#each archGame.playersStats as player}
        <div class="player-row">
          <span class="bold">{player.name}</span>
          <span>Punkte: {player.pointsTotal}</span>
          <span>Küsimusi leitud: {player.markersFound.length}</span>
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
