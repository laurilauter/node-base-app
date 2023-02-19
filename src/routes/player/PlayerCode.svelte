<script>
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../Splash.svelte";
  //import { isLoggedIn } from "../stores.js";
  //export let params = {};

  let code;
  let message;
  let error;

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  function toStart() {
    if (code) {
      push("/player-start/:id");
    }
  }
  // async function startGame() {
  //   const response = await fetch(`${baseURL}/game/playerjoin`, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       gameId: params,
  //       name: name,
  //     }),
  //   });

  //   const responseData = await response.json();
  //   //responseData = JSON.stringify(json);
  //   message = responseData.message;
  //   error = responseData.error;
  //   console.log("message ", message);

  //Send gameInfo from BE. Store this on LocalStorage, so that when the player
  //follows the joinGame link again then name is taken from LocalStorage and
  //if the BE tells the game is still on then the player can continue current game

  // if (session) {
  //   console.log("in");
  //   $isLoggedIn = true;
  //   replace("/dashboard");
  // } else {
  //   $isLoggedIn = false;
  // }
  // console.log("isLoggedIn Login afterSession  ", $isLoggedIn);
  // }
</script>

<div class="row-container">
  <div class="column-container">
    <Splash />
    <div class="start-form">
      <h2>Sisesta mängu kood</h2>
      <form action="" method="post">
        <div class="container">
          <input
            type="text"
            placeholder="Kood"
            name="kood"
            bind:value={code}
            required
          />
          <button type="button" id="login-button" on:click={toStart}
            >Alusta</button
          >
          <!-- <p>
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
          </p> -->
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
