<script>
  import { baseURL } from "../../lib/utilities/baseUrl";
  import Loader from "../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  import moment from "moment";

  let archivedGames = [];

  async function getGamePlans() {
    const response = await fetch(
      `${baseURL}/archive/list/${$sessionUserInfo.id}`
    );
    archivedGames = await response.json();
    console.log("archivedGames ", archivedGames);
    console.log("isUserLoggedIn at MyGamePlans ", $isUserLoggedIn);
  }

  onMount(async () => {
    getGamePlans();
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Mängude ajalugu</h1>
  <div>
    <ul>
      {#each archivedGames as archivedGame}
        <li>
          <a href="#/host/archived-game/{archivedGame._id}">
            <span>{archivedGame.gameCode}</span>
            <span>{archivedGame.gamePlan.gameTitle}</span>
            <span
              >{moment(archivedGame.gameEndTime).format("DD-MMM-YYYY HH:MM")}
            </span>
          </a>
        </li>
      {:else}
        <Loader />
      {/each}
    </ul>
  </div>
</div>

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
