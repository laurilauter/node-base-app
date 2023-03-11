<script>
  import baseURL from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import Splash from "../../lib/utilities/Splash.svelte";

  let code;
  let message;
  let error;

  function toStart() {
    if (code) {
      push(`/player-start/${code}`);
    }
  }
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
