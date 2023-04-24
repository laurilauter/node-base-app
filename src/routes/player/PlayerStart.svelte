<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { onMount } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";
  import { player } from "../../stores.js";
  import { waitingRoomStatus } from "../../stores.js";
  import { socket } from "../../socket.js";
  export let params = {};

  let name;
  let error;
  let currentPlayer;
  let currentGame;
  let code;
  let data;

  async function sendData(data) {
    socket.send(JSON.stringify(data));
  }

  async function joinGame() {
    try {
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

      if (response) {
        const responseData = await response.json();
        error = responseData.error;
        currentPlayer = responseData.player;
        console.log("currentPlayer ", currentPlayer);
        console.log("error ", error);

        if (currentPlayer) {
          $player = {
            _id: currentPlayer._id,
            playerName: currentPlayer.name,
            gameCode: currentPlayer.gameCode,
          };
          data = { event: "playerJoined" };
          await sendData(data);
          $waitingRoomStatus = "beforeGame";
          replace(`/waiting-room/${params.id}`);
        }
      }
    } catch (error) {
      replace(`/player-code`);
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
      if (error) {
        replace(`/player-code`);
      }
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
      <form action="" method="post" on:submit|preventDefault={joinGame}>
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
