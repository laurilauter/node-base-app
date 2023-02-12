<script>
  import { onMount } from "svelte";
  const baseURL = import.meta.env.VITE_BASE_URL_DEV;

  let gamePlans = [];

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/list`);
    gamePlans = await response.json();
  });
</script>

<div class="row-container">
  <div class="column-container">
    <p>Some</p>

    <div>
      {#each gamePlans as gamePlan}
        <div>
          <p>{gamePlan._id}</p>
          <h3>{gamePlan.gameTitle}</h3>
          <p>{gamePlan.gameMap}</p>
          <p>{gamePlan.ownerId}</p>
          <p>{gamePlan.gameDuration}</p>
          <p>{gamePlan.markers}</p>
        </div>
      {:else}
        <!-- this block renders when photos.length === 0 -->
        <p>loading...</p>
      {/each}
    </div>
  </div>
</div>

<style>
  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
  }

  .column-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
