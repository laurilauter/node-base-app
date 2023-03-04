<script>
  import baseURL from "./baseUrl";
  import { push, pop, replace, location } from "svelte-spa-router";
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  import LogOutFunc from "./LogOutFunc.svelte";
  let logOutGetter;

  let error;
  let sessionInfo;

  export async function getSession() {
    const session = sessionStorage.getItem("sessionId");
    if (session) {
      const response = await fetch(`${baseURL}/sessions/${session}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      let responseData = await response.json();
      console.log("responseData ", responseData);
      sessionInfo = responseData.sessionUser;
      console.log("sessionInfo ", sessionInfo);
      if (sessionInfo !== "user not logged in") {
        $isUserLoggedIn = true;
        $sessionUserInfo = {
          id: sessionInfo.id,
          email: sessionInfo.email,
          role: sessionInfo.role,
        };
      } else {
        $isUserLoggedIn = false;
        sessionStorage.clear();
        console.log("isLoggedInUser at LOGOUT ", $isUserLoggedIn);
        replace("/");
      }
      error = responseData.error;
    }
  }
</script>

<LogOutFunc bind:this={logOutGetter} />
