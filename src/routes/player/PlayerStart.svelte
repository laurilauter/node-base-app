<script>
  import baseURL from "../../lib/utilities/baseUrl";
  import { onMount } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";
  import { playerName } from "../../stores.js";
  export let params = {};

  let name;
  let error;
  let player;
  let currentGame;
  let code;

  async function joinGame() {
    const response = await fetch(`${baseURL}/game/playerjoin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        gameCode: params.id,
        name: name,
      }),
    });

    const responseData = await response.json();
    error = responseData.error;
    player = responseData.player;

    if (player) {
      //save data to localstorage, to recognize the player
      localStorage.setItem("player", JSON.stringify(player.name));
      localStorage.setItem("game", JSON.stringify(player.gameCode));
      //save player name to storage to trigger header in map view
      $playerName = player.name;
      push(`/player/map-view/${code}`);
    }
  }

  async function getGameInfo() {
    try {
      const response = await fetch(`${baseURL}/game/info/${params.id}`);
      const responseData = await response.json();
      currentGame = responseData.currentGame;
      code = currentGame.gameCode;
      console.log("currentGame", currentGame.gameCode);
      error = responseData.error;
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    getGameInfo();
  });
</script>

<div class="row-container">
  <div class="column-container">
    <Splash />
    <div class="start-form">
      <h2>Alusta mängu</h2>
      <form action="" method="post">
        <div class="container">
          <input
            type="text"
            placeholder="Nimi"
            name="nimi"
            bind:value={name}
            required
          />
          <button type="button" id="login-button" on:click={joinGame}
            >Alusta</button
          >
          {#if params.id === code}
            <h3>Mäng {currentGame.gameCode} leitud!</h3>
          {:else}
            <h3>Mängu {params.id} ei leitud!</h3>
          {/if}
          <p>
            {#if player}
              <p>code: {player.gameCode}</p>
              <p>name: {player.name}</p>
              <p>_id: {player._id}</p>
            {/if}
          </p>
          <p>
            {#if error}
              {error}
            {/if}
          </p>
        </div>
      </form>
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
