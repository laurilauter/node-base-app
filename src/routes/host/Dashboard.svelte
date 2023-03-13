<script>
  import { fade } from "svelte/transition";
</script>

<h1>Minu valikud</h1>
<div class="menu-list" in:fade={{ duration: 1000 }}>
  <h3><a href="#/host/active-game">Minu mäng</a></h3>
  <h3><a href="#/host/my-plans">Minu kavandid</a></h3>
  <h3><a href="#/host/game-history">Mängude ajalugu</a></h3>
</div>

<style>
  .menu-list > h3 {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
</style>
