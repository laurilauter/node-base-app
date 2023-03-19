<script>
  import LogOutFunc from "../lib/utilities/LogOutFunc.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Splash from "../lib/utilities/Splash.svelte";
  import { isUserLoggedIn } from "../stores.js";

  let logOutGetter;

  function play() {
    push("/player-code");
  }

  function create() {
    push("/host-login");
  }

  onMount(async () => {
    if ($isUserLoggedIn) {
      replace("/host");
    } else {
      logOutGetter.logout();
    }
  });
</script>

<div>
  <Splash />
  <div class="column-container">
    <div class="container">
      <p>Vali kas soovid mängida, või luua mänge.</p>
      <!-- <p>{$isUserLoggedIn}</p> -->
    </div>
    <div class="container">
      <button type="button" id="login-button" on:click={play}>Mängija</button>
      <br />
      <button type="button" id="login-button" on:click={create}>Looja</button>
    </div>
  </div>
  <LogOutFunc bind:this={logOutGetter} />
</div>

<style>
  /* Add padding to containers */
  .container {
    min-width: 300px;
    padding: 16px;
  }
</style>
