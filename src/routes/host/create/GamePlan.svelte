<script>
  // @ts-nocheck

  import { baseURL } from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { currentGamePlan } from "../../../stores.js";
  import { currentGamePlanMarkers } from "../../../stores.js";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import GamePlanGet from "../../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../../lib/utilities/GamePlanMarkersGet.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
  export let params = {};

  let gamePlanGetter;
  let gamePlanMarkerGetter;
  // Icon properties
  export let size = "2em"; // string | number
  export let ariaHidden = false; // boolean
  let show = false;

  async function deleteGamePlan() {
    const response = await fetch(
      `${baseURL}/game-plan/delete/${$currentGamePlan._id}`,
      {
        method: "DELETE",
      }
    );
    console.log("delete response ", response);
    replace("/host/my-plans");
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      let bodyContent;
      if (field === "title") {
        bodyContent = JSON.stringify({
          gameTitle: newValue,
        });
      }

      (async () => {
        try {
          const response = await fetch(
            `${baseURL}/game-plan/update/${$currentGamePlan._id}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: bodyContent,
            }
          );
          $currentGamePlan = await response.json();
        } catch (error) {
          console.log({ error: error });
        }
      })();
    };
  }

  onMount(async () => {
    await gamePlanGetter.getGamePlan(params.id);
    await gamePlanMarkerGetter.getGamePlanMarkers(params.id);
  });
</script>

{#if $currentGamePlan}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      <div class="row-container">
        <div class="invisible-dummy" />
        <div class="title-box">
          <h2>
            <InPlaceEdit
              bind:value={$currentGamePlan.gameTitle}
              on:submit={submit("title")}
            >
              <Pencil size={"2rem"} ariaHidden={false} />
            </InPlaceEdit>
          </h2>
        </div>

        <div>
          <span class="link-button" on:click={deleteGamePlan} on:keypress>
            <TrashCanOutline {size} {ariaHidden} />
          </span>
        </div>
      </div>
      <a href="#/game-plan/game-quiz/{$currentGamePlan._id}"
        ><h3 class="menu-list-item">Mängu küsimused</h3></a
      >
      <a href="#/game-plan/game-map/{$currentGamePlan._id}"
        ><h3 class="menu-list-item">Mängu kaart</h3></a
      >
      <label>
        <input type="checkbox" bind:checked={show} />
        Igavad andmed
      </label>
    </div>
    {#if show}
      <div class="info-box">
        <h4>from STORE $currentGamePlan</h4>
        <p>Map: {$currentGamePlan.gameMap}</p>
        <p>ID: {$currentGamePlan._id}</p>
        <p>OwnerId: {$currentGamePlan.ownerId}</p>
        <p>Markers:</p>
        <div>
          {#each $currentGamePlan.markers as marker}
            <p>{marker}</p>
          {/each}
        </div>
        <h4>Markers from STORE $currentGamePlanMarkers</h4>
        <div>
          {#each Object.entries($currentGamePlanMarkers) as [key, value]}
            <h4>MARKER {key}:</h4>
            {#each Object.entries(value) as [key, value]}
              <h4>{key}:</h4>
              {#if typeof value !== "string"}
                {#each Object.entries(value) as [key, value]}
                  <h4>{key}:</h4>
                  {#if typeof value !== "string"}
                    {#each Object.entries(value) as [key, value]}
                      <h4>{key}:</h4>
                      {#if typeof value !== "string"}
                        {#each Object.entries(value) as [key, value]}
                          <h4>{key}:</h4>
                          {#if typeof value !== "string"}
                            {#each Object.entries(value) as [key, value]}
                              <p>{key}: {value}</p>
                            {/each}
                          {:else}
                            <p>{value}</p>
                          {/if}
                        {/each}
                      {:else}
                        <p>{value}</p>
                      {/if}
                    {/each}
                  {:else}
                    <p>{value}</p>
                  {/if}
                {/each}
              {:else}
                <p>{value}</p>
              {/if}
            {/each}
          {/each}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <p><Loader /></p>
{/if}
<GamePlanGet bind:this={gamePlanGetter} />
<GamePlanMarkersGet bind:this={gamePlanMarkerGetter} />

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

  .info-box {
    font-size: 0.7rem;
    border: 1px solid var(--main-color);
    border-radius: 9px;
    min-width: 320px;
  }

  .menu-list-item {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
</style>
