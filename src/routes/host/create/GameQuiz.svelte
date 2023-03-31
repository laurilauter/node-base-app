<script>
  // @ts-nocheck
  import { baseURL } from "../../../lib/utilities/baseUrl";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import GamePlanGet from "../../../lib/utilities/GamePlanGet.svelte";
  import GamePlanMarkersGet from "../../../lib/utilities/GamePlanMarkersGet.svelte";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";
  import PrinterOutline from "svelte-material-icons/PrinterOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
  import { sessionUserInfo } from "../../../stores.js";
  import { currentGamePlan } from "../../../stores.js";
  import { currentGamePlanMarkers } from "../../../stores.js";
  import { userQrCodes } from "../../../stores.js";
  import QrModal from "../../../lib/utilities/popup/QrModal.svelte";
  import { Modals, closeModal } from "svelte-modals";
  import { openModal } from "svelte-modals";

  let currentQrCodes;
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
            qrcode: {
              qrCodeTitle: `Kood ${$currentGamePlanMarkers.length + 1}`,
              ownerId: $sessionUserInfo.id,
            },
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

  async function getCodes() {
    const response = await fetch(`${baseURL}/qr/list/${$sessionUserInfo.id}`);
    console.log("$sessionUserInfo.id ", $sessionUserInfo.id);
    currentQrCodes = await response.json();
    currentQrCodes.unshift({ _id: "", qrCodeTitle: "Puudub" });
    $userQrCodes = currentQrCodes;
    console.log("currentQrCodes ", currentQrCodes);
    console.log("$userQrCodes ", $userQrCodes);
  }

  function handleClick(code) {
    openModal(QrModal, { code: code });
  }

  onMount(async () => {
    await gamePlanGetter.getGamePlan(params.id);
    await gamePlanMarkerGetter.getGamePlanMarkers(params.id);
    await getCodes();
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
                  >
                    <Pencil size={"2rem"} ariaHidden={false} />
                  </InPlaceEdit>
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
                    >
                      <Pencil size={"1rem"} ariaHidden={false} />
                      <span
                        class="answer-link-button"
                        on:click={submit(`removeanswer-${key}-${answersKey}`)}
                        on:keypress
                      >
                        <TrashCanOutline size={"1rem"} ariaHidden={false} />
                      </span>
                    </InPlaceEdit>
                  </label>
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

            <div class="code-div">
              <span>QR:</span>
              <span class="bold">
                {value.content.qrcode.qrCodeTitle}
              </span>
              <span
                class="link-button"
                on:click={handleClick(value.content.qrcode.qrCodeTitle)}
                on:keypress
                ><PrinterOutline size={"2.1rem"} ariaHidden={false} /></span
              >
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
<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} on:keypress />
</Modals>
<span />

<style>
  .question-container {
    max-width: 600px;
    padding: 1rem;
    border: 1px solid rgb(58, 58, 58);
    border-radius: 9px;
    margin-bottom: 10px;
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
    justify-content: space-between;
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

  .answer-ckh-txt > label,
  input {
    cursor: pointer;
  }

  .answer-link-button {
    color: var(--link-color);
    border-radius: 0;
    border: 0px solid transparent;
    margin-left: 0.2em;
    font-size: 1em;
    font-weight: 400;
    font-family: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  .answer-link-button:hover {
    color: var(--link-hover-color);
  }

  .bold {
    font-weight: bold;
    margin: 10px;
  }

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .code-div {
    display: flex;
    justify-content: end;
    align-items: center;
  }
</style>
