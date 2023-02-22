<script>
  import { fade } from "svelte/transition";
  import { currentGamePlan } from "../../../stores.js";
  import { onMount } from "svelte";
  export let params = {};
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlan;

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/${params.id}`);
    gamePlan = await response.json();
    currentGamePlan.set(gamePlan);
  });
</script>

{#if gamePlan}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      <h1>{gamePlan.gameTitle}</h1>
      <h3><span>Duration</span> {gamePlan.gameDuration} min</h3>
      <a href="#/game-plan/game-quiz/{gamePlan._id}"
        ><h3 class="bold">Mängu küsimused</h3></a
      >
      <a href="#/game-plan/game-map/{gamePlan._id}"><h3>Mängu kaart</h3></a>
    </div>
    <div class="box">
      <p>Map: {gamePlan.gameMap}</p>
      <p>ID: {gamePlan._id}</p>
      <p>OwnerId: {gamePlan.ownerId}</p>
    </div>
  </div>
{:else}
  <p>loading...</p>
{/if}

<style>
  /* .bold {
    font-weight: bold;
    color: #d4cab0;
  } */

  .box {
    border: 1px solid grey;
    border-radius: 9px;
    min-width: 350px;
  }
</style>
