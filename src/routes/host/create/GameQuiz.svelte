<script>
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

  //if gamePlan, then get each marker.data ...
</script>

<h1>Mängu küsimused</h1>

{#if gamePlan}
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
</style>
