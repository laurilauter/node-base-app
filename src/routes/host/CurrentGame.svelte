<script>
  import baseURL from "./../../lib/utilities/baseUrl";
  import SessionGet from "./../../lib/utilities/SessionGet.svelte";
  import { sessionUserInfo } from "../../stores.js";
  import { currentGame } from "../../stores.js";
  import { currentPlayers } from "../../stores.js";
  import { currentJoinLink } from "../../stores.js";
  import { onMount } from "svelte";
  import Select from "./play//Select.svelte";
  import moment from "moment";

  let selected;
  let userGamePlans;
  let joinLink;
  let sessionGetter;
  let myCurrentGame;
  let yes;
  let error;
  let message;

  const now = moment();
  let time = now.add(1, "hour");

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

  async function getGameInfo() {
    try {
      const response = await fetch(
        `${baseURL}/game/info/${$currentGame.gameCode}`
      );
      const responseData = await response.json();
      myCurrentGame = responseData.currentGame;
      console.log("currentGame", myCurrentGame);
      $currentGame = {
        _id: myCurrentGame._id,
        gameStatus: myCurrentGame.gameStatus,
        gameCode: myCurrentGame.gameCode,
        players: myCurrentGame.players,
      };
      error = responseData.error;
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function activateGame() {
    try {
      const response = await fetch(`${baseURL}/game/activate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamePlanId: selected._id,
          gameStartTime: time.toISOString(),
        }),
      });

      let activeGame = await response.json();

      joinLink = activeGame.joinUrl;
      if (joinLink) {
        $currentGame.gameStatus = "activated";
        $currentGame.gameCode = joinLink.split("/").pop();
        $currentJoinLink = joinLink;
        console.log("joinLink ", joinLink);
      }
    } catch (error) {
      console.log({ error: error });
    }
  }

  async function startGame() {
    console.log("started");
    $currentGame.gameStatus = "started";
  }

  async function endGame() {
    try {
      const response = await fetch(
        `${baseURL}/game/end/${$currentGame.gameCode}`
      );
      let endedGame = await response.json();
      message = endedGame.message;
      $currentGame.gameStatus = "none";
      $currentJoinLink = "";
      $currentGame = {
        _id: "",
        gameStatus: "none",
        gameCode: "",
        players: [],
      };
      console.log("message ", message);
    } catch (error) {
      console.log({ error: error });
    }
  }

  onMount(async () => {
    await sessionGetter.getSession();
    await getGamePlans();
    await getGameInfo();
    await getPlayers();
  });
</script>

<h1>Jooksev mäng</h1>
<div class="info-box">
  <span>$currentGame._id </span>
  1currentGame._id<br />
  <span>$currentGame.gameStatus </span>
  {$currentGame.gameStatus}<br />
  <span>$currentGame.gameCode </span>
  {$currentGame.gameCode}<br />
  <span>$currentGame.players </span>
  {$currentGame.players}<br />
</div>
<br />

{#if $currentGame.gameStatus === "none"}
  <div>
    <p>Valmi mänugplaan ja alusta mängu.</p>
    <Select
      options={userGamePlans}
      display_func={(o) => o.gameTitle}
      bind:value={selected}
    />
  </div>
  <br />

  <p>{yes}</p>

  <button class="btn" on:click={activateGame}>Alusta</button>
{:else if $currentGame.gameStatus === "activated"}
  <div>
    <label for="appt">Vali millal mäng lõppeb (default is now +1h):</label>
    <input type="time" bind:value={time} required />
    <p>{time}</p>
  </div>
  <h3>Kui mängijad on kohal, siis vajuta Start.</h3>
  <!-- set btn to disabled if no players -->
  <button class="btn" on:click={startGame}>Start</button>
{:else if $currentGame.gameStatus === "started"}
  <button class="btn" on:click={endGame}>Lõpeta</button>
{/if}

{#if $currentJoinLink}
  <p><a href={$currentJoinLink} target="”_blank”">{joinLink}</a></p>
{/if}
{#if $currentGame.gameStatus === "activated" || $currentGame.gameStatus === "started"}
  <div>
    <h2>
      Mängijad
      <span><button class="btn" on:click={getPlayers}>Uuenda</button></span>
    </h2>

    {#if $currentPlayers}
      {#each $currentPlayers as player}
        <div class="player-box">
          <span class="bold">
            {player.name}
          </span>
          <span>
            Vastatud: {player.markersFound}
          </span>
          <span>
            Punkte: {player.pointsTotal}
          </span>
        </div>
      {/each}
    {/if}
  </div>
{/if}
<SessionGet bind:this={sessionGetter} />

<style>
  .btn {
    max-width: 160px;
  }

  .info-box {
    border-radius: 5px;
    font-size: 0.8rem;
    border: 1px solid grey;
    width: 400px;
    margin-left: 25%;
    margin-right: auto;
    color: grey;
  }

  .player-box {
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    font-size: 1rem;
    border: 1px solid grey;
    width: 400px;
    margin-left: 25%;
    margin-right: auto;
    margin-top: 10px;
  }

  .bold {
    font-weight: bold;
  }
</style>
