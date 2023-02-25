<script>
  import { currentGamePlanLink } from "./../../../stores.js";
  import MapFrame from "./MapFrame.svelte";
  import MapPlus from "svelte-material-icons/MapPlus.svelte";
  import { fade } from "svelte/transition";
  export let params = {};
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlan;
  let input;

  let statusCode;

  async function handleSubmit() {
    const locationParts = $currentGamePlanLink.location.split("/");
    console.log();
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
      gamePlan = await response.json();
    }
  }

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/${params.id}`);
    gamePlan = await response.json();
  });
</script>

<h1>Mängu kaart</h1>

{#if gamePlan}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <!-- {statusCode} -->
    <div class="row-container">
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
    <MapFrame>
      <img src="{baseURL}/uploads/{gamePlan.gameMap}" alt="map" />
    </MapFrame>
  </div>
  <br />
  <h4>Markerid</h4>
  <div>
    {#each gamePlan.markers as marker}
      <p>{marker}</p>
    {:else}
      <p><Loader /></p>
    {/each}
  </div>
{:else}
  <p><Loader /></p>
{/if}

<style>
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: none;
  }
</style>
