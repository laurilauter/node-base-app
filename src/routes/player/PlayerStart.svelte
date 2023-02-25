<script>
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";
  //import { isUserLoggedIn } from "../stores.js";
  export let params = {};

  let name;
  let message;
  let error;

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  async function startGame() {
    const response = await fetch(`${baseURL}/game/playerjoin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        gameId: params,
        name: name,
      }),
    });

    const responseData = await response.json();
    //responseData = JSON.stringify(json);
    message = responseData.message;
    error = responseData.error;
    console.log("message ", message);

    //Send gameInfo from BE. Store this on LocalStorage, so that when the player
    //follows the joinGame link again then name is taken from LocalStorage and
    //if the BE tells the game is still on then the player can continue current game

    // if (session) {
    //   console.log("in");
    //   $isUserLoggedIn = true;
    //   replace("/dashboard");
    // } else {
    //   $isUserLoggedIn = false;
    // }
    // console.log("isUserLoggedIn Login afterSession  ", $isUserLoggedIn);
  }
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
          <button type="button" id="login-button" on:click={startGame}
            >Alusta</button
          >
          <p>
            {#if params.id}
              {params.id}
            {/if}
          </p>
          <p>
            {#if message}
              {message}
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
