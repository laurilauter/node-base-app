<script>
  // @ts-nocheck
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { currentGamePlanMarker, player } from "../../stores.js";
  import { playerAnswers } from "../../stores.js";
  import { onMount } from "svelte";
  import { socket } from "../../socket.js";
  export let params = {};

  let userMarkerAnswers;
  let answerHolder = [];

  let checked = false;

  function sendData(data) {
    socket.send(JSON.stringify(data));
  }

  async function updatePlayer() {
    let points = 0;
    for (let i = 0; i < answerHolder.length; i++) {
      console.log(
        "userMarkerAnswers[i].isCorrect ",
        userMarkerAnswers[i].isCorrect
      );
      console.log("answerHolder ", answerHolder);
      if (userMarkerAnswers[i].isCorrect === answerHolder[i]) {
        points++;
      } else if (userMarkerAnswers[i].isCorrect !== answerHolder[i]) {
        points--;
      }
    }
    console.log("points before 0 ", points);

    points = points / answerHolder.length;
    if (points < 1) {
      points = 0;
    }
    let result = {
      id: $currentGamePlanMarker._id,
      isCorrect: false,
    };
    if (points === 1) {
      result.isCorrect = true;
      $playerAnswers.push(result);
    } else {
      result.isCorrect = false;
      $playerAnswers.push(result);
    }
    console.log("playerAnswers ", $playerAnswers);

    console.log("points ", points);
    try {
      const response = await fetch(`${baseURL}/game/player/${$player._id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          points: points,
          marker: $currentGamePlanMarker._id,
        }),
      });
      let updatedPlayerStats = await response.json();
      console.log("updatedPlayerStats ", updatedPlayerStats);
      if (updatedPlayerStats) {
        let data = { event: "scoreUpdate" };
        sendData(data);
      }
    } catch (error) {
      console.log({
        error: error,
      });
    }
    //show some feedback before routing
    replace(`/player/map-view/${params.gameCode}`);
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      console.log("userMarkerAnswers ", userMarkerAnswers);
      console.log("answerHolder ", answerHolder);
      let toggle = userMarkerAnswers[field].isCorrect;
      userMarkerAnswers[field].isCorrect = !toggle;
    };
  }

  async function getMarker(id) {
    try {
      const response = await fetch(`${baseURL}/game-plan/marker/${id}`);
      let gamePlanMarker = await response.json();
      console.log("gamePlanMarker", gamePlanMarker);
      userMarkerAnswers = gamePlanMarker.content.quiz.answers;
      userMarkerAnswers.forEach((element) => {
        answerHolder.push(element.isCorrect);
        element.isCorrect = false;
      });
      console.log("userMarkerAnswers ", userMarkerAnswers);
      console.log("answerHolder ", answerHolder);

      $currentGamePlanMarker = gamePlanMarker;
      console.log("$currentGamePlanMarker ", $currentGamePlanMarker);
    } catch (error) {
      console.log({
        error: error,
      });
    }
  }

  onMount(async () => {
    await getMarker(params.markerId);
  });
</script>

<div class="quiz-container" in:fade={{ duration: 1000 }}>
  <h3>{$currentGamePlanMarker.content.quiz.question}</h3>
  <div class="answers-container">
    {#each Object.entries($currentGamePlanMarker.content.quiz.answers) as [answersKey, answersValue]}
      <div class="answer">
        <div class="answer-ckh-txt">
          <div class="check">
            <input
              type="checkbox"
              id={answersValue.id}
              bind:value={checked}
              on:change={submit(answersKey)}
            />
          </div>
          <div class="answer-text">
            <p>{answersValue.text}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="vasta-btn">
    <button on:click={updatePlayer}>Vasta</button>
  </div>
</div>

<style>
  .quiz-container {
    margin: 20px;
  }

  .answers-container {
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .answer-text {
    text-align: left;
  }

  .answer {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .answer-ckh-txt {
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
  }

  input {
    margin-right: 10px;
    cursor: pointer;
  }

  .vasta-btn {
    display: flex;
    justify-content: center;
  }

  .vasta-btn > button {
    max-width: 400px;
  }
</style>
