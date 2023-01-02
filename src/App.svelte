<script>
  import axios from "axios";

  import Login from "./lib/Login.svelte";
  import TextBox from "./lib/TextBox.svelte";
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8080";
  //adjust axios baseURL depending on envirionment
  if (import.meta.env.MODE === "production") {
    axios.defaults.baseURL = "http://geoquiz.eu-4.evennode.com/";
  }
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
