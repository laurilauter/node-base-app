<script>
  // @ts-nocheck

  import baseURL from "../../../lib/utilities/baseUrl";
  import { currentGamePlanLink } from "./../../../stores.js";
  import { currentGamePlan } from "../../../stores.js";
  import { currentGamePlanMarkers } from "../../../stores.js";
  import GamePlanGet from "../../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../../lib/utilities/GamePlanMarkersGet.svelte";
  import MapFrame from "./MapFrame.svelte";
  import MapPlus from "svelte-material-icons/MapPlus.svelte";
  import { fade } from "svelte/transition";
  export let params = {};
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";

  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlanGetter;
  let gamePlanMarkerGetter;

  let m = { x: 0, y: 0 };

  function handleMousemove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }

  //let gamePlan;
  let input;

  let statusCode;

  async function handleSubmit() {
    const locationParts = $currentGamePlanLink.location.split("/");
    if (input.files.length > 0) {
      const formData = new FormData();
      formData.append("file", input.files[0]);
      const response = await fetch(
        `${baseURL}/game-plan/upload-map/${locationParts[2]}`,
        {
          method: "POST",
          body: formData,
        }
      );
      statusCode = response.status;
      const gamePlan = await response.json();
      $currentGamePlan.gameMap = gamePlan.gameMap;
      console.log("gamePlan from HANDLE ", gamePlan);
    }
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      const fragments = field.split("-");
      console.log("fragments ", fragments);
      console.log("newValue ", newValue);

      // if (fragments[0] === "question") {
      //   $currentGamePlanMarkers[fragments[1]].content.quiz.question = newValue;
      // } else if (fragments[0] === "answer" && fragments.length > 2) {
      //   $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
      //     fragments[2]
      //   ].text = newValue;
      // } else if (fragments[0] === "check" && fragments.length > 2) {
      //   let toggle =
      //     $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
      //       fragments[2]
      //     ].isCorrect;
      //   $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
      //     fragments[2]
      //   ].isCorrect = !toggle;
      // } else if (fragments[0] === "addanswer") {
      //   $currentGamePlanMarkers[fragments[1]].content.quiz.answers.push({
      //     text: "vastus",
      //     isCorrect: true,
      //   });
      // } else if (fragments[0] === "removeanswer" && fragments.length > 2) {
      //   $currentGamePlanMarkers[fragments[1]].content.quiz.answers.splice(
      //     fragments[2],
      //     1
      //   );
      // }
      console.log("store after submit ", $currentGamePlanMarkers[fragments[1]]);

      (async () => {
        try {
          const response = await fetch(
            `${baseURL}/game-plan/update-marker/${
              $currentGamePlanMarkers[fragments[1]]._id
            }`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify($currentGamePlanMarkers[fragments[1]]),
            }
          );
          let updatedGamePlanMarker = await response.json();
          console.log("updatedGamePlanMarker ", updatedGamePlanMarker);
        } catch (error) {
          console.log({ error: error });
        }
        gamePlanMarkerGetter.getGamePlanMarkers(params.id);
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
    <!-- {statusCode} -->
    <div class="row-container">
      <h1>Mängu kaart</h1>
      <label>
        <span class="link-button">
          <MapPlus {size} {ariaHidden} />
        </span>
        <input
          bind:this={input}
          on:change={handleSubmit}
          type="file"
          style="display:none"
        />
      </label>
    </div>

    <!-- <MapFrame mapMarkers={gamePlan.markers}>
      <img src="{baseURL}/uploads/{gamePlan.gameMap}" alt="map" />
      </MapFrame> -->
    <div class="map-row-container">
      <div class="map-box">
        <div
          class="map-inner-box"
          style="background-image: url({baseURL}/uploads/{$currentGamePlan.gameMap}); object-fit: conscale-down; background-repeat: no-repeat; width: 600px; height: auto;"
          on:mousemove={handleMousemove}
        >
          <h3>
            The mouse position is {m.x} x {m.y}
          </h3>
          <!-- CRIOP THE THING IN BE -->
          <!-- <img src="{baseURL}/uploads/{$currentGamePlan.gameMap}" alt="map" /> -->
        </div>
      </div>
      <div class="info-box">
        {#each Object.entries($currentGamePlanMarkers) as [key, value]}
          <input
            type="radio"
            id={value._id}
            bind:value={key}
            on:change={submit(`mouse-${key}`)}
          />
          <!-- Need to know KEY and New X and Y -->
          <label for={value._id}
            >{value.title} - {value.content.quiz.question}</label
          >
          <p>_id: {value._id}</p>
          <h4>x: {value.content.position.x} y: {value.content.position.y}</h4>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <p><Loader /></p>
{/if}

<GamePlanGet bind:this={gamePlanGetter} />
<GamePlanMarkersGet bind:this={gamePlanMarkerGetter} />

<style>
  /* img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: none;
  } */

  .map-box {
    margin: 10px;
    border: none;
    border-radius: 9px;
    width: 600px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .map-inner-box {
    border-radius: 9px;
    min-width: 100%;
    min-height: 100%;
  }

  .map-inner-box > h3 {
    color: black;
  }

  .map-row-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    align-items: top;
  }

  .info-box {
    margin: 10px;
    font-size: 0.7rem;
    border: 1px solid var(--main-color);
    border-radius: 9px;
    min-width: 560px;
    height: auto;
    padding: 20px;
  }
</style>
