<script>
  import Login from "../lib/Login.svelte";
</script>

<div>
  <img src="global-search.svg" alt="Search icon" />
  <h1>Otsi ja vasta</h1>
  <div>
    <p>
      This sample shows how to set up the router with minimum functionality.
    </p>
    <p>
      <em>Hint:</em> Try navigating with the links below, then use your browser's
      back and forward buttons.
    </p>
  </div>
  <div class="card">
    <Login />
  </div>
</div>

<style>
  /* div {
    border: solid red 1px;
  } */

  img {
    margin-top: 50px;
    max-height: 100px;
    width: auto;
  }
</style>
