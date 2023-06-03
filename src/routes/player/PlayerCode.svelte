<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";
  import { onMount } from "svelte";
  import { player } from "../../stores.js";

  let code;
  let error;

  async function toStart() {
    if (code) {
      await getGameInfo();
      if (error === "Game not found") {
      } else {
        replace(`/player-start/${code}`);
      }
    }
  }

  async function getGameInfo() {
    const response = await fetch(`${baseURL}/game/info/${code}`);
    const responseData = await response.json();
    error = responseData.error;
    if (error) {
      code = "";
    }
  }

  // function getLocalPlayer() {
  //   const gameCode = JSON.parse(localStorage.getItem("gameId"));
  //   const playerName = JSON.parse(localStorage.getItem("playerName"));
  //   console.log(gameCode, playerName);
  //   console.log("game ", parseInt(gameCode));
  //   if (gameCode && playerName) {
  //     push(`/player/map-view/${parseInt(gameCode)}`);
  //     $player.playerName = playerName;
  //   }
  // }

  onMount(async () => {
    //getLocalPlayer();
  });
</script>

<div class="row-container">
  <div class="column-container">
    <Splash />
    <div class="start-form">
      <h2>Sisesta mängu võti</h2>
      <form action="" method="post" on:submit|preventDefault={toStart}>
        <div class="container">
          <input
            type="text"
            placeholder="Kood"
            name="kood"
            bind:value={code}
            required
          />
          <button type="button" on:click={toStart}>Alusta</button>
        </div>
      </form>
      {#if error}
        <p>Sellise võtmega mängu ei leitud.</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .start-form {
    max-width: 300px;
  }

  /* Add padding to containers */
  .container {
    padding: 16px;
  }
</style>
