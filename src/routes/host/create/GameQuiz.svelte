<script>
  // @ts-nocheck

  import baseURL from "../../../lib/utilities/baseUrl";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import GamePlanGet from "../../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../../lib/utilities/GamePlanMarkersGet.svelte";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
  import { currentGamePlan } from "../../../stores.js";
  import { currentGamePlanMarkers } from "../../../stores.js";

  let gamePlanGetter;
  let gamePlanMarkerGetter;
  let checked;
  export let params = {};

  async function addQuestion() {
    console.log("$currentGamePlan._id is:", $currentGamePlan._id);
    const response = await fetch(`${baseURL}/game-plan/create-marker`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        marker: {
          title: $currentGamePlanMarkers.length + 1,
          gamePlanId: $currentGamePlan._id,
          content: {
            position: {
              x: 0,
              y: 0,
            },
            qrcode: "some QR code",
            quiz: {
              question: "Kas soovid muuta küsimust?",
              answers: [
                {
                  text: "pole kindel",
                  isCorrect: false,
                },
                {
                  text: "jah",
                  isCorrect: true,
                },
                {
                  text: "ei",
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
    gamePlanMarkerGetter.getGamePlanMarkers(params.id);
  }

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
          gamePlanId: $currentGamePlan._id,
        }),
      }
    );

    console.log("delete response ", response);
    gamePlanMarkerGetter.getGamePlanMarkers(params.id);
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      const fragments = field.split("-");
      console.log("fragments ", fragments);
      console.log("newValue ", newValue);

      if (fragments[0] === "question") {
        $currentGamePlanMarkers[fragments[1]].content.quiz.question = newValue;
      } else if (fragments[0] === "answer" && fragments.length > 2) {
        $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
          fragments[2]
        ].text = newValue;
      } else if (fragments[0] === "check" && fragments.length > 2) {
        let toggle =
          $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
            fragments[2]
          ].isCorrect;
        $currentGamePlanMarkers[fragments[1]].content.quiz.answers[
          fragments[2]
        ].isCorrect = !toggle;
      } else if (fragments[0] === "addanswer") {
        $currentGamePlanMarkers[fragments[1]].content.quiz.answers.push({
          text: "vastus",
          isCorrect: true,
        });
      } else if (fragments[0] === "removeanswer" && fragments.length > 2) {
        $currentGamePlanMarkers[fragments[1]].content.quiz.answers.splice(
          fragments[2],
          1
        );
      }
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

<h2>Mängu küsimused</h2>
<p>Klikka küsimustel ja vastustel, et neid muuta.</p>

{#if $currentGamePlanMarkers}
  <div class="column-container" in:fade={{ duration: 1000 }}>
    <div>
      {#each Object.entries($currentGamePlanMarkers) as [key, value]}
        <div class="question-container">
          <div class="question-box">
            <div class="row-container-question">
              <div class="question-title">
                <span>{parseInt(key) + 1}</span>
                <!-- <span>{value.title}</span> -->
              </div>
              <div>
                <span class="link-text">
                  <InPlaceEdit
                    bind:value={value.content.quiz.question}
                    on:submit={submit(`question-${key}`)}
                  />
                </span>
              </div>
              <div class="question-box-trash">
                <span
                  class="link-button"
                  on:click={removeQuestion(value._id)}
                  on:keypress
                >
                  <span>
                    <TrashCanOutline size={"2rem"} ariaHidden={false} />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="answers-container">
            {#each Object.entries(value.content.quiz.answers) as [answersKey, answersValue]}
              <div class="answer">
                <div class="answer-ckh-txt link-text">
                  <div>
                    <input
                      type="checkbox"
                      id={answersValue.id}
                      checked={answersValue.isCorrect ? true : false}
                      bind:value={checked}
                      on:change={submit(`check-${key}-${answersKey}`)}
                    />
                  </div>
                  <label for={answersValue.id}>
                    <InPlaceEdit
                      bind:value={answersValue.text}
                      on:submit={submit(`answer-${key}-${answersKey}`)}
                    />
                  </label>
                </div>
                <div class="answer-trash">
                  <span
                    class="link-button"
                    on:click={submit(`removeanswer-${key}-${answersKey}`)}
                    on:keypress
                  >
                    <TrashCanOutline size={"1.4rem"} ariaHidden={false} />
                  </span>
                </div>
              </div>
            {/each}
            <div class="add-answer">
              <span
                class="link-button"
                on:click={submit(`addanswer-${key}`)}
                on:keypress
              >
                <PlusCircleOutline size={"2.1rem"} ariaHidden={false} />
              </span>
            </div>
          </div>
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
  <PlusCircleOutline size={"3rem"} ariaHidden={false} />
</span>
<GamePlanGet bind:this={gamePlanGetter} />
<GamePlanMarkersGet bind:this={gamePlanMarkerGetter} />

<style>
  .question-container {
    max-width: 600px;
    padding: 1rem;
  }
  .question-box {
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .question-box-trash {
    display: flex;
    text-align: center;
    width: 65px;
  }

  .question-title {
    margin-left: 3px;
    margin-right: 12px;
    border: 2px solid var(--main-color);
    border-radius: 50%;
    min-width: 24px;
    height: auto;
    font-weight: 900;
  }

  .row-container-question {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    height: auto;
    min-width: 100%;
  }

  .add-answer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: fit-content;
    height: 2.4rem;
  }

  .add-answer > span {
    margin-left: 0px;
  }

  .answer {
    display: flex;
    justify-content: space-between;
  }

  .answer-ckh-txt {
    padding: 10px 0 10px 0;
    display: flex;
    justify-content: space-between;
  }

  .answer-trash {
    display: flex;
    text-align: center;
  }
</style>
