<script>
  const baseURL = import.meta.env.VITE_BASE_URL_DEV;
  import { push, pop, replace } from "svelte-spa-router";
  import { isLoggedIn } from "../stores.js";

  let message;

  console.log("isLoggedInUser Logout ", $isLoggedIn);

  async function logout() {
    const response = await fetch(`${baseURL}/sessions/logout`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();
    message = responseData.message;
    if (message) {
      $isLoggedIn = false;
      push("/");
    }
  }
</script>

<span on:click={logout}> <h4 class="logout">VÄLJU</h4> </span>

<style>
  .logout {
    color: goldenrod;
    cursor: pointer;
  }

  .logout:hover {
    background-color: rgb(54, 65, 65);
    color: gold;
  }
</style>
