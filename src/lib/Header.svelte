<script>
  import { push, pop, replace, location } from "svelte-spa-router";
  import Logout from "./Logout.svelte";
  import { isLoggedIn } from "../stores.js";

  console.log("isLoggedIn Header ", $isLoggedIn);

  function back() {
    pop();
  }
</script>

<header>
  <nav>
    {#if $isLoggedIn}
      <div>
        <button class="link-button" on:click={back}>Back</button>
      </div>
      <p>{$location}</p>
      <div>
        <Logout />
      </div>
    {/if}
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: center;
    margin-top: 0;
  }

  nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
</style>
