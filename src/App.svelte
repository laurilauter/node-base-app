<script>
  import { push, pop, replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import routes from "./routes/routes";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";

  // Handles the "conditionsFailed" event dispatched by the router when a component can't be loaded because one of its pre-condition failed
  function conditionsFailed(event) {
    console.error("conditionsFailed event", event.detail);
    console.log("loginState ", event.detail.userData);

    // Perform any action, for example replacing the current route
    //if (event.detail.userData.foo == "bar") {
    replace("/host-login");
    //}
  }

  // Handles the "routeLoaded" event dispatched by the router when a component was loaded
  function routeLoaded(event) {
    console.log("routeLoaded event", event.detail);
    console.log("loginState ", event.detail.userData);
  }
</script>

<div id="page-container">
  <div id="content-wrap">
    <Header />
    <!-- Use one router for Host and another for Player -->
    <Router
      {routes}
      on:conditionsFailed={conditionsFailed}
      on:routeLoaded={routeLoaded}
    />
    <footer id="footer">
      <Footer />
    </footer>
  </div>
</div>

<style>
</style>
