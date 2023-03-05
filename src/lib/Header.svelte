<script>
  import { currentGamePlanLink } from "./../stores.js";
  import { push, pop, replace, location } from "svelte-spa-router";
  import Logout from "./Logout.svelte";
  import SessionGet from "./utilities/SessionGet.svelte";
  import { isUserLoggedIn } from "../stores.js";
  import { playerName } from "../stores.js";
  import { sessionUserInfo } from "../stores.js";
  import { onMount } from "svelte";
  import Home from "svelte-material-icons/Home.svelte";

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
    <div class="column-container width-100-perc">
      <div class="row-container-between">
        {#if $isUserLoggedIn || $playerName}
          <div>
            <span class="side-m5">
              <a href="#/host/"> <Home {size} {ariaHidden} /></a>
            </span>
          </div>
        {/if}
        {#if $isUserLoggedIn}
          <div>
            <Logout>
              <span class="side-m5 hidden-mobile">
                {$sessionUserInfo.email}
              </span>
            </Logout>
          </div>
        {:else if $sessionUserInfo.email === undefined}
          No email
        {:else if $playerName}
          <div class="player-name">{$playerName}</div>
        {/if}
      </div>
      <div class="row-container">
        {#if $currentGamePlanLink && $location.slice(0, 15) === "/game-plan/game"}
          <span class="side-m5">
            <h3>
              <a href="/#{$currentGamePlanLink.location}">
                {$currentGamePlanLink.title}</a
              >
            </h3>
          </span>
        {/if}
      </div>
    </div>
  </nav>
  <SessionGet bind:this={sessionGetter} />
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
