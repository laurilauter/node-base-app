<script>
  import { onMount } from "svelte";
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let gamePlans = [];

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/list`);
    gamePlans = await response.json();
  });
</script>

<div>
  <h1>Minu mängud</h1>
  <div>
    {#each gamePlans as gamePlan}
      <div>
        <ul>
          <li>
            <a href="#/game-plan/{gamePlan._id}">{gamePlan.gameTitle}</a>
          </li>
        </ul>
      </div>
    {:else}
      <p>loading...</p>
    {/each}
  </div>
  <br />
  <div>
    <ul>
      <li><a href="#/my-codes">Minu QR koodid</a></li>
    </ul>
  </div>
</div>

<style>
  ul {
    list-style-type: none;
    font-weight: bold;
    font-size: 24px;
  }
  li {
    padding: 16px;
  }
</style>
