<script>
  import { push, pop, replace } from "svelte-spa-router";
  import { isLoggedIn } from "../stores.js";

  let email;
  let password;
  let error;
  let session;

  let baseURL = import.meta.env.VITE_BASE_URL_DEV;
  if (import.meta.env.PROD) {
    baseURL = import.meta.env.VITE_BASE_URL_PROD;
  }

  async function loginUser() {
    const response = await fetch(`${baseURL}/sessions/login`, {
      method: "POST",
      //credentials: "same-origin",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const responseData = await response.json();
    //responseData = JSON.stringify(json);
    session = responseData.session;
    error = responseData.error;
    console.log("responseData at LOGIN", responseData);

    if (session && !$isLoggedIn) {
      console.log("inSession at LOGIN");
      $isLoggedIn = true;
      push("/host");
    }
    console.log("isLoggedIn at LOGIN", $isLoggedIn);
  }
</script>

<div class="row-container">
  <div class="column-container">
    <div class="login-form">
      <h2>Logige sisse</h2>
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
            name="password"
            bind:value={password}
            required
          />
          <button type="button" id="login-button" on:click={loginUser}
            >Sisene</button
          >
          <!-- <p>
            <input type="checkbox" id="remember" name="remember" value="true" />
            <label for="remember"> Mäleta mind selles seadmes</label>
          </p> -->
          <p>
            {#if error}
              {error}
            {/if}
          </p>
        </div>
      </form>
    </div>
  </div>
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
