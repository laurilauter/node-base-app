<script>
  import baseURL from "./utilities/baseUrl";
  import { push, pop, replace } from "svelte-spa-router";
  import { isUserLoggedIn } from "../stores.js";
  import { sessionId } from "../stores.js";
  import Session from "./utilities/Session.svelte";

  let email;
  let passwordFirst;
  let passwordSecond;
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
        password: passwordFirst,
      }),
    });

    const responseData = await response.json();
    session = responseData.session;
    error = responseData.error;
    console.log("responseData at LOGIN R ", responseData);

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

  async function registerUser() {
    if (passwordFirst === passwordSecond) {
      const response = await fetch(`${baseURL}/user/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: passwordFirst,
          role: "user",
        }),
      });
      const responseData = await response.json();
      error = responseData.error;
      console.log("responseData at REGISTER", responseData);

      loginUser();
    } else {
      error = "Salasõnad on erinevad";
    }
  }
</script>

<div class="row-container">
  <div class="column-container">
    <div class="login-form">
      <h2>Looge konto</h2>
      <form action="" method="post">
        <div class="container">
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
            name="password-first"
            bind:value={passwordFirst}
            required
          />
          <input
            type="password"
            placeholder="Salasõna"
            name="password-second"
            bind:value={passwordSecond}
            required
          />
          <button type="button" id="login-button" on:click={registerUser}
            >Registreeri</button
          >
          <p>
            {#if error}
              {error}
            {/if}
          </p>
          <p><a href="#/host-login">Logige hoopis sisse</a></p>
        </div>
      </form>
    </div>
  </div>
  <Session bind:this={sessionGetter} />
</div>

<style>
  .login-form {
    max-width: 300px;
  }

  /* Add padding to containers */
  .container {
    padding: 16px;
  }
</style>
