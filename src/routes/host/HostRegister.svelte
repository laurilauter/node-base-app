<script>
  import Register from "./../../lib/Register.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import routes from "./routes.txt";
  import Splash from "../../lib/Splash.svelte";
</script>

<div>
  <Splash />
  <div>
    <p>Siit saad siseneda kasutajana, et hallata oma mänge või luua uusi.</p>
  </div>
  <Register />
</div>

<style>
</style>
