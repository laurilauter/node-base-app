<script>
  // @ts-nocheck

  import { baseURL } from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { currentGame } from "../../stores.js";
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  import { currentGamePlanMarkers } from "../../stores.js";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";

  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let myCurrentGame;
  let error;
  let gamePlans = [];

  async function getGamePlans() {
    const response = await fetch(
      `${baseURL}/game-plan/list/${$sessionUserInfo.id}`
    );
    gamePlans = await response.json();
    console.log("gamePlans ", gamePlans);
    console.log("isUserLoggedIn at MyGamePlans ", $isUserLoggedIn);
  }

  async function addGamePlan() {
    const response = await fetch(`${baseURL}/game-plan/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        gameTitle: "Mängu Nimi",
        gameMap: "testmap.png",
        ownerId: $sessionUserInfo.id,
        markers: [],
      }),
    });

    const responseData = await response.json();
    // session = responseData.session;
    // error = responseData.error;
    console.log("responseData at ADD PLAN", responseData);
    getGamePlans();
  }

  async function getActiveGame() {
    try {
      const response = await fetch(
        `${baseURL}/game/active/${$sessionUserInfo.id}`
      );
      const responseData = await response.json();
      if (responseData.currentGame) {
        myCurrentGame = responseData.currentGame;
        $currentGame = myCurrentGame;
        console.log("currentGame", myCurrentGame);
        console.log("$currentGame ", $currentGame);
      } else {
        error = responseData.error;
        $currentGame = {
          _id: "",
          gameStatus: "",
          gameCode: "",
          players: [],
          gamePlan: {
            _id: "",
          },
        };
      }
    } catch (error) {
      $currentGame.gamePlan._id = "0";
      console.log("$currentGame.gamePlan._id  ", $currentGame.gamePlan._id);
      console.log({ error: error });
    }
    console.log("$currentGame ", $currentGame);
  }

  onMount(async () => {
    $currentGamePlanMarkers = [];
    await getActiveGame();
    await getGamePlans();
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Minu kavandid</h1>
  <div>
    <ul>
      {#each gamePlans as gamePlan}
        <li>
          {#if gamePlan._id === $currentGame.gamePlan._id}
            <span class="big-bold">{gamePlan.gameTitle}</span>
            <span>AKTIIVNE</span>
          {:else}
            <a href="#/game-plan/{gamePlan._id}"
              ><h3>{gamePlan.gameTitle}</h3></a
            >
          {/if}
          <!-- {/if} -->
        </li>
      {:else}
        <Loader />
      {/each}
    </ul>
    <span class="link-button" on:click={addGamePlan} on:keypress>
      <PlusCircleOutline {size} {ariaHidden} />
    </span>
  </div>
  <!-- <br />
  <div>
    <h3><a href="#/host/my-codes">Minu QR koodid</a></h3>
  </div> -->
</div>

<style>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .big-bold {
    font-size: 1.8rem;
    margin-right: 10px;
  }
</style>
