<script>
  import { fade } from "svelte/transition";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlanLink } from "../../../stores.js";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  export let params = {};
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlan;

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/${params.id}`);
    gamePlan = await response.json();
    $currentGamePlanLink = {
      location: $location,
      title: gamePlan.gameTitle,
    };
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
  <p><Loader /></p>
{/if}

<style>
  .box {
    border: 1px solid grey;
    border-radius: 9px;
    min-width: 350px;
  }
</style>
