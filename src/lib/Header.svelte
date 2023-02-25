<script>
  import { currentGamePlanLink } from "./../stores.js";
  import { push, pop, replace, location } from "svelte-spa-router";
  import Logout from "./Logout.svelte";
  import Session from "./utilities/Session.svelte";
  import { isUserLoggedIn } from "../stores.js";
  import { playerName } from "../stores.js";
  import { sessionUserInfo } from "../stores.js";
  import { onMount } from "svelte";
  import Home from "svelte-material-icons/Home.svelte";

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }
  // all properties are optional
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let sessionGetter;

  onMount(async () => {
    sessionGetter.getSession();
  });
</script>

<header>
  <nav>
    {#if $isUserLoggedIn || $playerName}
      <div class="row-container">
        <span class="side-m5">
          <a href="#/host/"> <Home {size} {ariaHidden} /></a>
        </span>
        {#if $currentGamePlanLink && $location.slice(0, 15) === "/game-plan/game"}
          <span class="side-m5">
            <a href="/#{$currentGamePlanLink.location}"
              >{$currentGamePlanLink.title}</a
            >
          </span>
        {/if}
      </div>
    {/if}
    {#if $isUserLoggedIn}
      <div>
        <Logout>
          <span class="side-m5">
            {$sessionUserInfo.email}
          </span>
        </Logout>
      </div>
    {:else if $playerName}
      <div class="player-name">{$playerName}</div>
    {/if}
  </nav>
  <Session bind:this={sessionGetter} />
</header>

<style>
  header {
    display: flex;
    justify-content: center;
    margin-top: 0;
  }

  nav {
    width: 100%;
    margin: 0 10px 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .player-name {
    display: flex;
    align-items: center;
  }

  .side-m5 {
    margin: 0 5px 0 5px;
  }
</style>
