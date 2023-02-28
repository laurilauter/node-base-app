<script>
  import baseURL from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlanLink } from "../../../stores.js";
  import { currentGamePlan } from "../../../stores.js";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import EditTitle from "../../../lib/utilities/EditTitle.svelte";
  import EditDuration from "../../../lib/utilities/EditDuration.svelte";
  export let params = {};

  // Icon properties
  export let size = "2em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlan = $currentGamePlan;

  async function deleteGamePlan() {
    const response = await fetch(
      `${baseURL}/game-plan/delete/${gamePlan._id}`,
      {
        method: "DELETE",
      }
    );
    console.log("response ", response);
    replace("/host/my-games");
  }

  function submitTitle(field) {
    console.log("in submit func - ", field);
    return ({ detail: newValue }) => {
      console.log(`updated ${field}, new value is: "${newValue}"`);
      (async () => {
        try {
          const response = await fetch(
            `${baseURL}/game-plan/update/${gamePlan._id}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                gameTitle: newValue,
              }),
            }
          );
          console.log("gamePlan updated via submitTitle");
          gamePlan = await response.json();
        } catch (error) {
          console.log({ error: error });
        }
      })();
    };
  }

  function submitDuration(field) {
    console.log("in submit func - ", field);
    return ({ detail: newValue }) => {
      console.log(`updated ${field}, new value is: "${newValue}"`);
      (async () => {
        try {
          const response = await fetch(
            `${baseURL}/game-plan/update/${gamePlan._id}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                gameDuration: parseInt(newValue),
              }),
            }
          );
          console.log("gamePlan updated via submitDuration");
          gamePlan = await response.json();
        } catch (error) {
          console.log({ error: error });
        }
      })();
    };
  }

  async function getGamePlan(id) {
    console.log("getGamePlan from DB");
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
      <!-- <h2>
        <EditTitle
          bind:value={gamePlan.gameTitle}
          on:submitTitle={submitTitle("title")}
        />
      </h2> -->

      <span class="link-button" on:click={deleteGamePlan} on:keypress>
        <TrashCanOutline {size} {ariaHidden} />
      </span>

      <h3>
        <span>Kestus</span>
        <span>
          <EditDuration
            bind:value={gamePlan.gameDuration}
            on:submitDuration={submitDuration("duaration")}
          />
        </span>

        min
      </h3>

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
