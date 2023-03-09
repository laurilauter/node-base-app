<script>
  import baseURL from "./../../lib/utilities/baseUrl";
  import SessionGet from "./../../lib/utilities/SessionGet.svelte";
  import { sessionUserInfo } from "../../stores.js";
  import { onMount } from "svelte";
  import Select from "./play//Select.svelte";

  let selected;
  let userGamePlans;
  let sessionGetter;
  let yes;
  function say() {
    yes = selected.gameTitle;
  }
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

  onMount(async () => {
    await sessionGetter.getSession();
    getGamePlans();
  });
</script>

<div>
  <h1>Jooksev mäng</h1>
  <p>Valmi mänugplaan ja alusta mängu.</p>

  <Select
    options={userGamePlans}
    display_func={(o) => o.gameTitle}
    bind:value={selected}
  />
  <br />
  {JSON.stringify(selected, null, 2)}
  <br />
  {(console.log(selected), "")}
</div>
<br />

<div>
  <label for="appt">Vali möngu lõpuaeg:</label>
  <input type="time" id="appt" name="appt" required />
</div>

<button class="alusta-btn" on:click={say}>Alusta</button>
<h2>
  {yes}
</h2>

<SessionGet bind:this={sessionGetter} />

<style>
  .alusta-btn {
    max-width: 160px;
  }
</style>
