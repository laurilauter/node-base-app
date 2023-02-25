<script>
  import LogOutFunc from "../../lib/utilities/LogOutFunc.svelte";
  import Register from "./../../lib/Register.svelte";
  import Splash from "../../lib/utilities/Splash.svelte";
  import { onMount } from "svelte";
  import { isUserLoggedIn } from "../../stores.js";

  let logOutGetter;

  onMount(async () => {
    if ($isUserLoggedIn) {
      logOutGetter.logout();
    }
  });
</script>

<div>
  <Splash />
  <Register />
  <LogOutFunc bind:this={logOutGetter} />
</div>

<style>
</style>
