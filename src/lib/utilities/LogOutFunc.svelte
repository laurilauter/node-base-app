<script>
  import baseURL from "./baseUrl";
  import { isUserLoggedIn } from "../../stores.js";
  import { push, pop, replace } from "svelte-spa-router";

  let message;
  export async function logout() {
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
      sessionStorage.clear();
      console.log("isLoggedInUser at LOGOUT ", $isUserLoggedIn);
      replace("/");
    }
  }
</script>
