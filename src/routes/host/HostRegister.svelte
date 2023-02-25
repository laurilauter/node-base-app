<script>
  import Register from "./../../lib/Register.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import routes from "./routes.txt";
  import Splash from "../../lib/utilities/Splash.svelte";
</script>

<div>
  <Splash />
  <Register />
</div>

<style>
</style>
