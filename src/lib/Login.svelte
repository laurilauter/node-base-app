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
    console.log("responseData ", responseData);

    if (session) {
      console.log("in");
      $isLoggedIn = true;
      replace("/dashboard");
    } else {
      $isLoggedIn = false;
    }
    console.log("isLoggedIn Login afterSession  ", $isLoggedIn);
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
  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
  }

  .column-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form {
    max-width: 300px;
  }
  /* Bordered form */
  /* form {
  border: 1px solid #f1f1f1;
  border-radius: 9px;
} */

  /* Full-width inputs */
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 9px;
  }

  /* Set a style for all buttons */
  button {
    background-color: #04aa6d;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
    border-radius: 9px;
  }

  /* Add a hover effect for buttons */
  button:hover {
    opacity: 0.8;
  }

  /* Add padding to containers */
  .container {
    padding: 16px;
  }
</style>
