<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isUserLoggedIn } from "../../stores.js";

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlans = [];

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/list`);
    gamePlans = await response.json();
    console.log("isUserLoggedIn at MyGames ", $isUserLoggedIn);
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Minu mängud</h1>
  <div>
    <ul>
      {#each gamePlans as gamePlan}
        <li>
          <a href="#/game-plan/{gamePlan._id}"><h3>{gamePlan.gameTitle}</h3></a>
        </li>
      {:else}
        <p>loading...</p>
      {/each}
    </ul>
  </div>
  <br />
  <div>
    <h3><a href="#/host/my-codes">Minu QR koodid</a></h3>
  </div>
</div>

<style>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    margin: 10px;
  }
</style>
