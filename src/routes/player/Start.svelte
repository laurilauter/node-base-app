<script>
  import { push, pop, replace } from "svelte-spa-router";
  //import { isLoggedIn } from "../stores.js";
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
    //   $isLoggedIn = true;
    //   replace("/dashboard");
    // } else {
    //   $isLoggedIn = false;
    // }
    // console.log("isLoggedIn Login afterSession  ", $isLoggedIn);
  }
</script>

<div class="row-container">
  <div class="column-container">
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

  .start-form {
    max-width: 300px;
  }
  /* Bordered form */
  /* form {
  border: 1px solid #f1f1f1;
  border-radius: 9px;
} */

  /* Full-width inputs */
  input[type="text"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 9px;
  }

  /* Set a style for all buttons */
  button {
    background-color: #04aa6d;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
    border-radius: 9px;
  }

  /* Add a hover effect for buttons */
  button:hover {
    opacity: 0.8;
  }

  /* Add padding to containers */
  .container {
    padding: 16px;
  }
</style>
