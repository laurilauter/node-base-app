<script>
  import baseURL from "../../lib/utilities/baseUrl";
  import { onMount } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";
  import { player } from "../../stores.js";
  import { socket } from "../../socket.js";
  export let params = {};

  let name;
  let error;
  let currentPlayer;
  let currentGame;
  let code;
  let data;

  function sendData(data) {
    socket.send(JSON.stringify(data));
  }

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
    currentPlayer = responseData.player;
    console.log("currentPlayer ", currentPlayer);
    if (currentPlayer) {
      //save data to localstorage, to recognize the player
      localStorage.setItem("playerName", JSON.stringify(currentPlayer.name));
      localStorage.setItem("gameId", JSON.stringify(currentPlayer.gameCode));
      localStorage.setItem("playerId", JSON.stringify(currentPlayer._id));

      //save player name to storage to trigger header in map view
      $player = {
        _id: currentPlayer._id,
        playerName: currentPlayer.name,
        gameCode: currentPlayer.gameCode,
      };
      data = { event: "playerJoined" };
      sendData(data);
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
            {#if currentPlayer}
              <p>code: {currentPlayer.gameCode}</p>
              <p>name: {currentPlayer.name}</p>
              <p>_id: {currentPlayer._id}</p>
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
