<script>
  import { baseURL } from "./utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { isUserLoggedIn } from "../stores.js";
  import { sessionId } from "../stores.js";
  import SessionGet from "./utilities/SessionGet.svelte";

  let email;
  let password;
  let error;
  let session;
  let sessionGetter;

  async function loginUser() {
    const response = await fetch(`${baseURL}/sessions/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const responseData = await response.json();
    session = responseData.session;
    error = responseData.error;
    console.log("responseData at LOGIN", responseData);

    if (session && !$isUserLoggedIn) {
      console.log("inSession at LOGIN R ", session);
      $isUserLoggedIn = true;
      $sessionId = session;
      sessionStorage.setItem("sessionId", session);
      sessionGetter.getSession();
      replace("/host");
    } else {
      console.log(
        "session && !$isUserLoggedIn not met at LOGIN R, logging out"
      );
      replace("/host-login");
    }
    console.log("isUserLoggedIn at LOGIN R ", $isUserLoggedIn);
    console.log("sessionId at LOGIN R ", $sessionId);
  }
</script>

<div class="row-container">
  <div class="column-container">
    <div class="login-form">
      <h3>Logige sisse</h3>
      <div class="spikker">
        <span>toomas@toomas.com</span><br />
        <span>toomastoomas</span>
      </div>
      <form action="" method="post">
        <div class="login-container">
          <input
            type="email"
            placeholder="Email"
            name="email"
            bind:value={email}
            required
          />
          <input
            type="password"
            placeholder="Salasõna"
            name="password"
            bind:value={password}
            required
          />
          <button type="button" id="login-button" on:click={loginUser}
            >Sisene</button
          >
          <p>
            {#if error}
              {error}
            {/if}
          </p>
          <p><a href="#/host-register">Registreerige konto</a></p>
        </div>
      </form>
    </div>
  </div>
  <SessionGet bind:this={sessionGetter} />
</div>

<style>
  .spikker {
    font-size: 1rem;
  }
</style>
