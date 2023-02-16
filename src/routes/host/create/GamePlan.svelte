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
</script>

<h1>Minu mäng</h1>

{#if gamePlan}
  <div>
    <h2><span class="bold">Title</span> {gamePlan.gameTitle}</h2>
    <p><span class="bold">ID</span> {gamePlan._id}</p>
    <!-- <p><span class="bold">OwnerId</span> {gamePlan.ownerId}</p> -->
    <p><span class="bold">Duration</span> {gamePlan.gameDuration}</p>

    <!-- <p><span class="bold">Map</span> {gamePlan.gameMap}</p> -->
    <ul>
      <li>
        <a href="#/game-plan/game-map/{gamePlan._id}"
          ><span class="bold">Mängu kaart</span></a
        >
      </li>
      <li>
        <a href="#/game-plan/game-quiz/{gamePlan._id}"
          ><span class="bold">Mängu küsimused</span></a
        >
      </li>
    </ul>
  </div>
{:else}
  <p>loading...</p>
{/if}

<style>
  .bold {
    font-weight: bold;
    color: #d4cab0;
  }

  ul {
    list-style-type: none;
    font-weight: bold;
    font-size: 24px;
  }
  li {
    padding: 16px;
  }
</style>
