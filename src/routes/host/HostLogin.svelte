<script>
  import LogOutFunc from "../../lib/utilities/LogOutFunc.svelte";
  import Login from "./../../lib/Login.svelte";
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
  <Login />
  <LogOutFunc bind:this={logOutGetter} />
</div>

<style>
</style>
