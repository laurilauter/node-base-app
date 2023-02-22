<script>
  import MapFrame from "./MapFrame.svelte";
  import { fade } from "svelte/transition";
  export let params = {};
  import { onMount } from "svelte";
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlan;

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/${params.id}`);
    gamePlan = await response.json();
  });
</script>

<h1>Mängu kaart</h1>

{#if gamePlan}
  <h3>{gamePlan.gameMap}</h3>
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <MapFrame>
      <img src="vikk-map.png" alt="vite icon" />
      <!-- <img {gamePlan.gameMap} alt="vite icon" /> -->
    </MapFrame>
  </div>
  <br />
  <h4>Markerid</h4>
  <div>
    {#each gamePlan.markers as marker}
      <p>{marker}</p>
    {:else}
      <p>loading...</p>
    {/each}
  </div>
{:else}
  <p>loading...</p>
{/if}

<style>
  .bold {
    font-weight: bold;
    color: #d4cab0;
  }
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: none;
  }
</style>
