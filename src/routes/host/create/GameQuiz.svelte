<script>
  // @ts-nocheck

  import baseURL from "../../../lib/utilities/baseUrl";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
  import { currentGamePlan } from "../../../stores.js";

  export let params = {};
  // Icon properties
  export let size = "3em"; // string | number
  export let ariaHidden = false; // boolean

  let gamePlan = $currentGamePlan;
  let gamePlanMarkers;

  async function addQuestion() {
    console.log("$currentGamePlan._id ", gamePlan._id);
    const response = await fetch(`${baseURL}/game-plan/create-marker`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        marker: {
          title: gamePlanMarkers.length + 1,
          gamePlanId: gamePlan._id,
          content: {
            position: {
              x: 20,
              y: 30,
            },
            qrcode: "some QR code",
            quiz: {
              question: "Mitu jalga on koeral?",
              answers: [
                {
                  text: "kolm",
                  isCorrect: false,
                },
                {
                  text: "neli",
                  isCorrect: true,
                },
                {
                  text: "viis",
                  isCorrect: false,
                },
              ],
            },
          },
        },
      }),
    });

    const responseData = await response.json();
    console.log("responseData at ADD QUESTION", responseData);
    getQuestions(params.id);
  }

  async function updateQuestion() {}

  async function removeQuestion(markerId) {
    const response = await fetch(
      `${baseURL}/game-plan/delete-marker/${markerId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamePlanId: gamePlan._id,
        }),
      }
    );

    console.log("delete response ", response);
    getQuestions(params.id);
  }

  async function addAnswer() {}

  async function updateAnswer() {}

  async function removeAnswer() {}

  async function getQuestions(id) {
    const response = await fetch(`${baseURL}/game-plan/markers/${id}`);
    gamePlanMarkers = await response.json();
    console.log("gamePlanMarkers ", gamePlanMarkers);
  }

  onMount(async () => {
    getQuestions(params.id);
  });
</script>

<h1>Mängu küsimused</h1>

{#if gamePlanMarkers}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      {#each gamePlanMarkers as marker}
        <div class="question-title">
          <span class="bold">{marker.title}</span>
          <span> - </span>
          <span>{marker.content.quiz.question}</span>
          <span
            class="link-button"
            on:click={removeQuestion(marker._id)}
            on:keypress
          >
            <TrashCanOutline {size} {ariaHidden} />
          </span>
        </div>

        <div>
          {#each marker.content.quiz.answers as answer}
            <ul>
              <li>{answer.text}</li>
            </ul>
          {/each}
        </div>
      {:else}
        <h3>Küsimused puuduvad</h3>
      {/each}
    </div>
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

  ul {
    display: flex;
  }

  li {
  }

  .question-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
