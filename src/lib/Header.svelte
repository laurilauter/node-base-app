<script>
  // @ts-nocheck

  import { currentGamePlanLink, playerStats } from "./../stores.js";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import Logout from "./Logout.svelte";
  import SessionGet from "./utilities/SessionGet.svelte";
  import { isUserLoggedIn } from "../stores.js";
  import { player } from "../stores.js";
  import { sessionUserInfo } from "../stores.js";
  import { onMount } from "svelte";
  import Home from "svelte-material-icons/Home.svelte";
  import { socket } from "../socket.js";

  // all properties are optional
  // export let size = "3em"; // string | number
  // export let ariaHidden = false; // boolean

  let sessionGetter;
  // let data;
  // let incoming;

  // function sendData(info) {
  //   data = { info: info };
  //   socket.send(JSON.stringify(data));
  // }

  // socket.onmessage = function (event) {
  //   console.log(`WS Data received from server: ${event.data}`);
  //   incoming = event.data;
  // };

  function checkLocalPlayerInfo() {
    if (JSON.parse(localStorage.getItem("gameId")) === "") {
      $player = {
        _id: "",
        playerName: "",
        gameCode: "",
      };
    }
  }

  onMount(async () => {
    await sessionGetter.getSession();
    checkLocalPlayerInfo();
  });
</script>

<!-- Should be 2 types of headers, user and player header -->
{#if !$location.includes("/code-print/") || $location === "/"}
  <header>
    <nav>
      <div class="column-container width-100-perc">
        <div class="row-container-between">
          <div>
            {#if $isUserLoggedIn}
              <!-- <a href="#/host"> <Home {size} {ariaHidden} /></a> -->
              <a href="#/host">
                <div class="img-frame">
                  <img src="logo-c-140.svg" alt="logo" />
                </div>
              </a>
            {/if}
          </div>
          <div>
            {#if $isUserLoggedIn}
              <Logout>
                {$sessionUserInfo.email}
              </Logout>
            {:else if $player.playerName}
              <div class="player-info">
                <span>
                  {$player.playerName}
                </span>
              </div>
            {/if}
          </div>
        </div>
        <div class="row-container" in:fade={{ duration: 1000 }}>
          <h4>
            {#if $location.includes("/host/") || $location.includes("/game-plan/")}
              <a href="#/host">Algus</a>
              {#if $location.includes("/game-plan/")}
                <span>/</span>
                <a href="#/host/my-plans">Minu mängud</a>
              {:else if $location.includes("/archived-game/")}
                <span>/</span>
                <a href="#/host/game-history">Ajalugu</a>
                {#if $currentGamePlanLink && $location.slice(0, 15) === "/game-plan/game"}
                  <span>/</span>
                  <a href="/#{$currentGamePlanLink.location}">
                    {$currentGamePlanLink.title}</a
                  >
                {/if}
              {/if}
            {/if}
          </h4>
        </div>
      </div>
    </nav>
    <SessionGet bind:this={sessionGetter} />
  </header>
{/if}

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

  .player-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 16px;
  }

  /* .side-m5 {
    margin: 0 5px 0 5px;
  } */

  /* .img-frame {
    min-height: 50px;
    width: auto;
  } */

  .img-frame img {
    margin: 10px;
    height: 70px;
    width: 70px;
    object-fit: cover;
  }

  @media (max-width: 560px) {
    .img-frame img {
      margin: 5px;
      height: 40px;
      width: 40px;
      object-fit: cover;
    }
  }
</style>
