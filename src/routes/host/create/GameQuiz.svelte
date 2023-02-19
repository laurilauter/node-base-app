<script>
  export let params = {};
  import { onMount } from "svelte";
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlanMarkers;

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/markers/${params.id}`);
    gamePlanMarkers = await response.json();
    console.log("gamePlanMarkers ", gamePlanMarkers);
  });

  //if gamePlan, then get each marker.data ...
</script>

<h1>Mängu küsimused</h1>

{#if gamePlanMarkers}
  <div>
    {#each gamePlanMarkers as marker}
      <p>
        <span class="bold">{marker.title}</span>
        <span>{marker.content.quiz.question}</span>
        <span>EDIT</span>
        <span>DELETE</span>
      </p>
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
