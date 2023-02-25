<script>
  import baseURL from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlanLink } from "../../../stores.js";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  export let params = {};

  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlan;

  import InPlaceEdit from "../../.././lib/utilities/InPlaceEdit.svelte";

  let title = "This is an editable title";
  let summary = "This is some editable text";

  async function deleteGamePlan() {
    const response = await fetch(
      `${baseURL}/game-plan/delete/${gamePlan._id}`,
      {
        method: "DELETE",
      }
    );
    //const deleteResponse = await response.json();
    console.log("response ", response);
    replace("/host/my-games");
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      // IRL: POST value to server here
      console.log(`updated ${field}, new value is: "${newValue}"`);
    };
  }

  async function getGamePlan(id) {
    const response = await fetch(`${baseURL}/game-plan/${id}`);
    gamePlan = await response.json();
    $currentGamePlanLink = {
      location: $location,
      title: gamePlan.gameTitle,
    };
  }

  onMount(async () => {
    getGamePlan(params.id);
  });
</script>

{#if gamePlan}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      <h1>
        {gamePlan.gameTitle}
      </h1>
      <span class="link-button" on:click={deleteGamePlan} on:keypress>
        <TrashCanOutline {size} {ariaHidden} />
      </span>

      <h3><span>Kestus</span> {gamePlan.gameDuration} min</h3>
      <a href="#/game-plan/game-quiz/{gamePlan._id}"
        ><h3 class="bold">Mängu küsimused</h3></a
      >
      <a href="#/game-plan/game-map/{gamePlan._id}"><h3>Mängu kaart</h3></a>
    </div>

    <div class="box">
      <p>Map: {gamePlan.gameMap}</p>
      <p>ID: {gamePlan._id}</p>
      <p>OwnerId: {gamePlan.ownerId}</p>
    </div>
    <h1>
      <InPlaceEdit bind:value={title} on:submit={submit("title")} />
    </h1>

    <p>
      <InPlaceEdit bind:value={summary} on:submit={submit("text")} />
    </p>
  </div>
{:else}
  <p><Loader /></p>
{/if}

<style>
  .box {
    border: 1px solid grey;
    border-radius: 9px;
    min-width: 320px;
  }
</style>
