<script>
  // Import the router component
  // Normally, this would be: `import Router from 'svelte-spa-router'`
  import Router from "svelte-spa-router";
  // Import the list of routes
  import routes from "./routes/routes";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  //
</script>

<Header />

<div class="router-content">
  <!-- Show the router -->
  <div>
    <Router {routes} />
  </div>
</div>

<Footer />

<style>
  .router-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
