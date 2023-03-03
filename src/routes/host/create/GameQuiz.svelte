<script>
  import baseURL from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";

  export let params = {};
  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlanMarkers;

  async function addQuestion() {}

  async function updateQuestion() {}

  async function removeQuestion() {}

  async function addAnswer() {}

  async function updateAnswer() {}

  async function removeAnswer() {}

  onMount(async () => {
    const response = await fetch(`${baseURL}/game-plan/markers/${params.id}`);
    gamePlanMarkers = await response.json();
    console.log("gamePlanMarkers ", gamePlanMarkers);
  });
</script>

<h1>Mängu küsimused</h1>

{#if gamePlanMarkers}
  <div in:fade={{ duration: 1000 }}>
    {#each gamePlanMarkers as marker}
      <p>
        <span class="bold">{marker.title}</span>
        <span> - </span>
        <span>{marker.content.quiz.question}</span>
        {#each marker.content.quiz.answers as answer}
          {#if answer.isCorrect}
            <p class="green">{answer.text}</p>
          {:else}
            <p class="red">{answer.text}</p>
          {/if}
        {/each}
      </p>
    {:else}
      <h3>Küsimused puuduvad</h3>
    {/each}
  </div>
{:else}
  <p><Loader /></p>
{/if}
<span class="link-button" on:click={addQuestion} on:keypress>
  <PlusCircleOutline {size} {ariaHidden} />
</span>

<style>
  .bold {
    font-weight: bold;
    color: #d4cab0;
  }

  .green {
    color: green;
  }

  .red {
    color: red;
  }
</style>
