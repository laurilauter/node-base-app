<script>
  import { isUserLoggedIn } from "../../stores.js";
  import { sessionUserInfo } from "../../stores.js";
  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }
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
      sessionInfo = responseData.sessionUser;
      if (sessionInfo) {
        $isUserLoggedIn = true;
        $sessionUserInfo = {
          id: sessionInfo.id,
          email: sessionInfo.email,
          role: sessionInfo.role,
        };
      }
      error = responseData.error;
    }
  }
</script>
