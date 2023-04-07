<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  import SessionGet from "../../lib/utilities/SessionGet.svelte";
  import moment from "moment";

  let archivedGames = [];
  let sessionGetter;

  async function getGamePlans(id) {
    const response = await fetch(`${baseURL}/archive/list/${id}`);
    archivedGames = await response.json();
    console.log("archivedGames ", archivedGames);
    console.log("isUserLoggedIn at MyGamePlans ", $isUserLoggedIn);
  }

  onMount(async () => {
    await sessionGetter.getSession();
    await getGamePlans($sessionUserInfo.id);
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Mängude ajalugu</h1>
  <div>
    <ul>
      {#each archivedGames as archivedGame}
        <li>
          <a href="#/host/archived-game/code/{archivedGame.gameCode}">
            <span>{archivedGame.gameCode}</span>
            <span>{archivedGame.gamePlan.gameTitle}</span>
            <span
              >{moment(archivedGame.gameEndTime).format("DD-MM-YYYY HH:MM")}
            </span>
          </a>
        </li>
      {:else}
        <Loader />
      {/each}
    </ul>
  </div>
</div>
<SessionGet bind:this={sessionGetter} />

<style>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
</style>
