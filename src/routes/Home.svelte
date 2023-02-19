<script>
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "./Splash.svelte";

  function play() {
    push("/player-code");
  }

  function create() {
    push("/host-start");
  }
</script>

<div>
  <Splash />
  <div class="column-container">
    <div class="container">
      <p>Vali kas soovid mängida, või luua mänge.</p>
    </div>
    <div class="container">
      <button type="button" id="login-button" on:click={play}>Mängija</button>
      <br />
      <button type="button" id="login-button" on:click={create}>Looja</button>
    </div>
  </div>
</div>

<style>
  /* div {
    border: solid red 1px;
  } */

  /* Add padding to containers */
  .container {
    min-width: 300px;
    padding: 16px;
  }
</style>
