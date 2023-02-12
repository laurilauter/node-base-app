<script>
  import { push, pop, replace } from "svelte-spa-router";
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
        <button on:click={back}>Back</button>
      </div>
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
    display: flex;
    justify-content: center;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  /* li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  } */

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-theme-1);
  }
</style>
