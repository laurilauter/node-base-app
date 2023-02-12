<script>
  import { push, pop, replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import hostRoutes from "./host/hostRoutes";
  const prefix = "/dashboard";

  // Handles the "conditionsFailed" event dispatched by the router when a component can't be loaded because one of its pre-condition failed
  function conditionsFailed(event) {
    console.error("conditionsFailed event", event.detail);
    // Perform any action, for example replacing the current route
    //if (event.detail.userData.foo == "bar") {
    replace("/dashboard");
    //}
  }
  // Handles the "routeLoaded" event dispatched by the router when a component was loaded
  function routeLoaded(event) {
    console.log("routeLoaded event", event.detail);
  }
</script>

<div>
  <h1>Minu valikud</h1>
  <div>
    <ul>
      <li><a href="#/current-game">Jooksev mäng</a></li>
      <li><a href="#/my-games">Minu mängud</a></li>
      <li><a href="#/game-history">Mängude ajalugu</a></li>
    </ul>
  </div>
  <!-- <div class="router-content">
    <Router
      {hostRoutes}
      {prefix}
      on:conditionsFailed={conditionsFailed}
      on:routeLoaded={routeLoaded}
    />
  </div> -->
</div>

<style>
  .router-content {
    border: 1px solid green;
    min-height: 100px;
  }
  ul {
    list-style-type: none;
    font-weight: bold;
    font-size: 24px;
  }
  li {
    padding: 16px;
  }
</style>
