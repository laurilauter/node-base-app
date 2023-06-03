<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import SessionGet from "../../lib/utilities/SessionGet.svelte";
  import { sessionUserInfo } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentPlayers } from "../../stores.js";
  import { currentJoinLink } from "../../stores.js";
  import { onMount } from "svelte";
  import Select from "./play/Select.svelte";
  //import moment from "moment";
  import { socket } from "../../socket.js";

  let selected;
  let userGamePlans;
  let joinLink;
  let sessionGetter;
  let myCurrentGame;
  let error;
  let message;

  //const now = moment();
  //let time = now.add(1, "hour");

  function sendData(data) {
    socket.send(JSON.stringify(data));
    console.log("data sent from game server: ", data);
  }

  socket.onmessage = function (event) {
    console.log(`WS Data received from server: ${event.data}`);
    const receivedData = JSON.parse(event.data);
    console.log("receivedData parsed", receivedData);
    if (receivedData.event === "playerJoined") {
      getPlayers();
    } else if (receivedData.event === "scoreUpdate") {
      getPlayers();
    } else {
      console.log("receivedData ", receivedData);
    }
  };

  async function getGamePlans() {
    try {
      const response = await fetch(
        `${baseURL}/game-plan/list/${$sessionUserInfo.id}`
      );
      let gamePlanList = await response.json();
      userGamePlans = gamePlanList;
      console.log("userGamePlans ", userGamePlans);
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function getPlayers() {
    try {
      const response = await fetch(
        `${baseURL}/game/players/${$currentGame.gameCode}`
      );
      let playersData = await response.json();
      $currentPlayers = playersData.players;
      console.log("$currentPlayers ", $currentPlayers);
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function getActiveGame() {
    try {
      const response = await fetch(
        `${baseURL}/game/active/${$sessionUserInfo.id}`
      );
      const responseData = await response.json();
      if (responseData.currentGame) {
        myCurrentGame = responseData.currentGame;
        console.log("currentGame", myCurrentGame);
        $currentGame = myCurrentGame;
      } else {
        error = responseData.error;
        $currentGame = {
          _id: "",
          gamePlan: { _id: "" },
          gameStatus: "",
          gameCode: "",
          players: [],
        };
        $currentPlayers = [];
        $currentJoinLink = "";
      }
    } catch (error) {
      console.log({ error: error });
    }
    console.log("$currentGame ", $currentGame);
  }

  async function activateGame() {
    $currentPlayers = [];
    try {
      const response = await fetch(`${baseURL}/game/activate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamePlanId: selected._id,
          //gameEndTime: time.toISOString(), //fix this so it comes from the user selection
        }),
      });
      let activeGame = await response.json();
      joinLink = activeGame.joinUrl;
      if (joinLink) {
        $currentGame.gameStatus = "activated";
        $currentGame.gameCode = joinLink.split("/").pop();
        $currentGame.players = [];
        $currentJoinLink = joinLink;
        console.log("joinLink ", joinLink);
      }
      await getActiveGame();
      let data = { event: "gameActivated" };
      sendData(data);
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function startGame() {
    console.log("$currentGame.gameCode ", $currentGame.gameCode);
    let data = { event: "gameStarted" };
    sendData(data);
    try {
      const response = await fetch(
        `${baseURL}/game/start/${$currentGame.gameCode}`
      );
      const responseData = await response.json();
      myCurrentGame = responseData.currentGame;
      console.log("currentGame", myCurrentGame);
      $currentGame.gameStatus = "started";
      $currentGame = {
        _id: myCurrentGame._id,
        gamePlan: myCurrentGame.gamePlan,
        gameStatus: myCurrentGame.gameStatus,
        gameCode: myCurrentGame.gameCode,
        players: myCurrentGame.players,
      };
      console.log("$currentGame new: ", $currentGame);

      error = responseData.error;
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function endGame() {
    const finalScores = $currentPlayers;
    try {
      const response = await fetch(
        `${baseURL}/game/end/${$currentGame.gameCode}`
      );
      let endedGame = await response.json();
      message = endedGame.message;
      await getGamePlans();
      let data = { event: "gameEnded", finalScores: finalScores };
      sendData(data);
      replace(`/host/archived-game/code/${$currentGame.gameCode}`);
      $currentJoinLink = "";
      $currentGame = {
        _id: "",
        gamePlan: { _id: "" },
        gameStatus: "",
        gameCode: "",
        players: [],
      };
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function cancelGame() {
    try {
      const response = await fetch(
        `${baseURL}/game/cancel/${$currentGame.gameCode}`
      );
      let endedGame = await response.json();
      message = endedGame.message;
      replace("/host/active-game");
      $currentJoinLink = "";
      $currentGame = {
        _id: "",
        gamePlan: {
          _id: "",
        },
        gameStatus: "",
        gameCode: "",
        players: [],
      };
      await getGamePlans();
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    await sessionGetter.getSession();
    await getActiveGame();
    if ($currentGame.gameStatus === "") {
      await getGamePlans();
    }
    if (
      $currentGame.gameStatus === "activated" ||
      $currentGame.gameStatus === "started"
    ) {
      await getPlayers();
    }
  });
</script>

<h1>Sinu mäng {$currentGame.gameCode}</h1>
{#if $currentGame.gameStatus === ""}
  <div class="column-container">
    <p>Vali mänugplaan ja alusta mängu.</p>
    <Select
      options={userGamePlans}
      display_func={(o) => o.gameTitle}
      bind:value={selected}
    />
  </div>
  <br />

  <button class="btn" on:click={activateGame}>Alusta</button>
{:else if $currentGame.gameStatus === "activated"}
  <!-- <div>
    <p>Mängu lõpu aeg on testimiseks PRAEGU +1 tund</p> -->
  <!-- <label for="appt">Vali millal mäng lõppeb (default is now +1h):</label>
    <input type="time" bind:value={time} required /> -->
  <!-- <p>{time}</p>
  </div> -->

  <h3>Kui mängijad on kohal, siis vajuta Start.</h3>
  <!-- set btn to disabled if no players -->
  <button class="btn btn-cancel" on:click={cancelGame}>Tühista</button>
  <button
    class="btn"
    disabled={$currentPlayers.length > 0 ? false : true}
    on:click={startGame}>Start</button
  >
{:else if $currentGame.gameStatus === "started"}
  <button class="btn" on:click={endGame}>Lõpeta</button>
{/if}

{#if $currentJoinLink && $currentGame.gameStatus === "activated"}
  <h3>Otselink:</h3>
  <p class="green">{$currentJoinLink}</p>
  <h3>Mänugu võti:</h3>
  <h3 class="green">{$currentGame.gameCode}</h3>
{/if}
{#if $currentGame.gameStatus === "activated" || $currentGame.gameStatus === "started"}
  <div>
    <h2>Mängijad</h2>
    <div class="players-frame column-container">
      {#if $currentPlayers}
        {#each $currentPlayers as player}
          <div class="player">
            <span>{$currentPlayers.indexOf(player) + 1}.</span>
            <span class="bold">
              {player.name}
            </span>
            <span />
            <span>
              Küsimusi: {player.markersFound.length}
            </span>
            <span>
              Punkte: {player.pointsTotal}
            </span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<SessionGet bind:this={sessionGetter} />

<style>
  .green {
    color: var(--btn-bg-color);
  }
  .btn {
    max-width: 160px;
  }

  .btn-cancel {
    background-color: rgb(171, 140, 81);
  }

  .players-frame {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .player {
    display: flex;
    justify-content: space-around;
    width: 400px;
    border-radius: 5px;
    font-size: 1rem;
    border: 1px solid grey;
    margin-top: 10px;
  }

  .bold {
    font-weight: bold;
  }
</style>
