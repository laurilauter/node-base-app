<script>
  import Login from "./../../lib/Login.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import routes from "./routes.txt";
</script>

<div>
  <img src="global-search.svg" alt="Search icon" />
  <h1>Otsi ja vasta</h1>
  <div>
    <p>
      This sample shows how to set up the router with minimum functionality.
    </p>
  </div>
  <Login />
</div>

<style>
  /* div {
      border: solid red 1px;
    } */

  img {
    margin-top: 50px;
    max-height: 100px;
    width: auto;
  }
</style>
