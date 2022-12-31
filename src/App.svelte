<script>
  import axios from "axios";
  axios.defaults.baseURL = "http://geoquiz.eu-4.evennode.com/";
  axios.defaults.withCredentials = true;
  import Login from "./lib/Login.svelte";
  import TextBox from "./lib/TextBox.svelte";
</script>

<main>
  <h1>Quiz</h1>

  <div class="card">
    <Login />
    <TextBox />
  </div>
</main>

<style>
</style>
