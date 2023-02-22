<script>
  import { push, pop, replace, location } from "svelte-spa-router";
  import Logout from "./Logout.svelte";
  import { isUserLoggedIn } from "../stores.js";
  import { playerName } from "../stores.js";
  import { sessionUserInfo } from "../stores.js";

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  console.log("isUserLoggedIn Header ", $isUserLoggedIn);

  function back() {
    pop();
  }
</script>

<header>
  <nav>
    {#if $isUserLoggedIn || $playerName}
      <div>
        <button class="link-button" on:click={back}>Tagasi</button>
      </div>
    {/if}
    {#if $isUserLoggedIn}
      <div class="row-container">
        <p>{$location}</p>
      </div>
      <div>
        <Logout>
          <span>
            {$sessionUserInfo.email}
          </span>
        </Logout>
      </div>
    {:else if $playerName}
      <div class="player-name">{$playerName}</div>
    {/if}
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: center;
    margin-top: 0;
  }

  nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .player-name {
    display: flex;
    align-items: center;
  }
</style>
