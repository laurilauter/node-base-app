<script>
  import baseURL from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlanLink } from "../../../stores.js";
  import { currentGamePlan } from "../../../stores.js";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
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
    console.log("delete response ", response);
    replace("/host/my-games");
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      let bodyContent;
      if (field === "title") {
        bodyContent = JSON.stringify({
          gameTitle: newValue,
        });
      } else if (field === "duration") {
        newValue = parseInt(newValue);
        if (isNaN(newValue)) {
          newValue = 45;
        }
        bodyContent = JSON.stringify({
          gameDuration: newValue,
        });
      }

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
              body: bodyContent,
            }
          );
          gamePlan = await response.json();
        } catch (error) {
          console.log({ error: error });
        }
      })();
    };
  }

  async function getGamePlan(id) {
    const response = await fetch(`${baseURL}/game-plan/${id}`);
    gamePlan = await response.json();
    $currentGamePlanLink = {
      location: $location,
      title: gamePlan.gameTitle,
    };
    $currentGamePlan = {
      _id: gamePlan._id,
      gameTitle: gamePlan.gameTitle,
      gameMap: gamePlan.gameMap,
      ownerId: gamePlan.ownerId,
      gameDuration: gamePlan.gameDuration,
      markers: gamePlan.markers,
    };
  }

  onMount(async () => {
    getGamePlan(params.id);
  });
</script>

{#if gamePlan}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      <div class="row-container">
        <div class="invisible-dummy" />
        <div class="title-box">
          <h2>
            <InPlaceEdit
              bind:value={gamePlan.gameTitle}
              on:submit={submit("title")}
            />
          </h2>
        </div>

        <div>
          <span class="link-button" on:click={deleteGamePlan} on:keypress>
            <TrashCanOutline {size} {ariaHidden} />
          </span>
        </div>
      </div>
      <div class="row-container min-box-wrapper">
        <span class="min-span-height"><h3>Kestus</h3></span>
        <div class="min-box">
          <span
            ><h3>
              <InPlaceEdit
                bind:value={gamePlan.gameDuration}
                on:submit={submit("duration")}
              />
            </h3>
          </span>
        </div>

        <span> <h3>min</h3></span>
      </div>

      <a href="#/game-plan/game-quiz/{gamePlan._id}"
        ><h3 class="bold">Mängu küsimused</h3></a
      >
      <a href="#/game-plan/game-map/{gamePlan._id}"><h3>Mängu kaart</h3></a>
    </div>

    <div class="box">
      <p>from DB</p>
      <p>Map: {gamePlan.gameMap}</p>
      <p>ID: {gamePlan._id}</p>
      <p>OwnerId: {gamePlan.ownerId}</p>
    </div>

    <div class="box">
      <p>from STORE</p>
      <p>Map: {$currentGamePlan.gameMap}</p>
      <p>ID: {$currentGamePlan._id}</p>
      <p>OwnerId: {$currentGamePlan.ownerId}</p>
    </div>
  </div>
{:else}
  <p><Loader /></p>
{/if}

<style>
  .title-box {
    display: flex;
    align-items: space-between;
    color: var(--link-color);
  }

  .title-box:hover {
    color: var(--link-hover-color);
  }

  .invisible-dummy {
    width: 72px;
    display: block;
  }

  .min-box {
    display: flex;
    align-items: center;
    color: var(--link-color);
    width: 42px;
    max-height: 2rem;
    margin: 0 10px 0 10px;
  }

  .min-box:hover {
    color: var(--link-hover-color);
  }

  .min-box-wrapper {
    display: flex;
    align-items: center;
    max-height: 2rem;
  }

  .box {
    border: 1px solid grey;
    border-radius: 9px;
    min-width: 320px;
  }
</style>
