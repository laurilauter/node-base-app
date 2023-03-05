<script>
  import baseURL from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  import { currentGamePlanMarkers } from "../../stores.js";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";

  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlans = [];
  //THIS LISTS GAMES FROM ALL USERS !!
  async function getGamePlans() {
    const response = await fetch(
      `${baseURL}/game-plan/list/${$sessionUserInfo.id}`
    );
    // const response = await fetch(`${baseURL}/game-plan/list`);
    gamePlans = await response.json();
    console.log("isUserLoggedIn at MyGames ", $isUserLoggedIn);
  }

  onMount(async () => {
    getGamePlans();
    $currentGamePlanMarkers = [];
  });

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
        gameDuration: 45,
        markers: [],
      }),
    });

    const responseData = await response.json();
    // session = responseData.session;
    // error = responseData.error;
    console.log("responseData at ADD PLAN", responseData);
    getGamePlans();
  }
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Minu mängud</h1>
  <div>
    <ul>
      {#each gamePlans as gamePlan}
        <li>
          <a href="#/game-plan/{gamePlan._id}"><h3>{gamePlan.gameTitle}</h3></a>
        </li>
      {:else}
        <Loader />
      {/each}
    </ul>
    <span class="link-button" on:click={addGamePlan} on:keypress>
      <PlusCircleOutline {size} {ariaHidden} />
    </span>
  </div>
  <br />
  <div>
    <h3><a href="#/host/my-codes">Minu QR koodid</a></h3>
  </div>
</div>

<style>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    margin: 10px;
  }
</style>
