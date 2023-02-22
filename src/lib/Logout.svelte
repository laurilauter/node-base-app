<script>
  import { push, pop, replace } from "svelte-spa-router";
  import { isUserLoggedIn } from "../stores.js";

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  let message;

  async function logout() {
    const response = await fetch(`${baseURL}/sessions/logout`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();
    message = responseData.message;
    if (message && $isUserLoggedIn) {
      $isUserLoggedIn = false;
      console.log("isLoggedInUser at LOGOUT ", $isUserLoggedIn);
      push("/");
    }
  }
</script>

<div class="row-container">
  <slot />
  <button class="link-button" on:click={logout}>Välju</button>
</div>

<style>
</style>
