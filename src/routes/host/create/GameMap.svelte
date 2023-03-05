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
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";

  export let params = {};
  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlanGetter;
  let gamePlanMarkerGetter;

  let m = { x: 0, y: 0 };
  let marekerKey = 0;
  function handleMousemove(event) {
    m.x = event.offsetX;
    m.y = event.offsetY;
  }

  function handleRadio(key) {
    marekerKey = key;
  }

  //let gamePlan;
  let input;

  let statusCode;

  //image upload
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

  function handleMapClick(field) {
    console.log("marekerKey ", marekerKey);
    console.log("m.x ", m.x);
    console.log("m.y ", m.y);
    return ({ detail: newValue }) => {
      console.log("newValue ", newValue);
      console.log(
        "$currentGamePlanMarkers[marekerKey] ",
        $currentGamePlanMarkers[marekerKey]
      );
      $currentGamePlanMarkers[marekerKey].content.position.x = m.x;
      $currentGamePlanMarkers[marekerKey].content.position.y = m.y;

      (async () => {
        try {
          const response = await fetch(
            `${baseURL}/game-plan/update-marker/${$currentGamePlanMarkers[marekerKey]._id}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify($currentGamePlanMarkers[marekerKey]),
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
    <div class="map-row-container">
      <div class="map-box">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="map-inner-box"
          on:mousemove={handleMousemove}
          on:click={handleMapClick("map-click")}
        >
          <p>
            The mouse position is {m.x} x {m.y}
          </p>
          <img src="{baseURL}/uploads/{$currentGamePlan.gameMap}" alt="map" />
          {#each Object.entries($currentGamePlanMarkers) as [key, value]}
            <div
              class="image-marker"
              style="top: {value.content.position.y - 20}px; left: {value
                .content.position.x - 20}px;"
            >
              {value.title}
            </div>
          {/each}
        </div>
      </div>
      <div class="info-box">
        <h3>Vali küsimus ja määra talle asukoht kaardil klikates.</h3>
        {#each Object.entries($currentGamePlanMarkers) as [key, value]}
          <input
            type="radio"
            name="radio"
            id={value._id}
            group={key}
            bind:value={key}
            on:change={handleRadio(key)}
          />
          <!-- Need to know KEY and New X and Y -->
          <label for={value._id}>
            {value.title} - {value.content.quiz.question}
          </label>
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
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 9px;
    /* border: 1px solid green; */
  }

  .map-box {
    margin: 10px;
    border: none;
    max-width: 600px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    /* border: 1px solid blue; */
  }
  .map-inner-box {
    min-width: 100%;
    min-height: 100%;
    position: relative;
    border: none;
    /* border: 1px solid yellow; */
  }

  .map-inner-box > p {
    color: black;
    top: -15px;
    left: 20px;
    position: absolute;
  }

  .map-row-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    align-items: top;
  }

  .image-marker {
    position: absolute;
    color: green;
    border: 3px solid green;
    background-color: rgb(142, 200, 142);
    opacity: 0.8;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-box {
    margin: 10px;
    border: 1px solid var(--main-color);
    border-radius: 9px;
    max-width: 560px;
    height: auto;
    padding: 20px;
  }
</style>
