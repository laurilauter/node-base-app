<script>
  import { fade } from "svelte/transition";
</script>

<h1>Minu valikud</h1>
<div in:fade={{ duration: 1000 }}>
  <h3><a href="#/host/current-game">Jooksev mäng</a></h3>
  <h3><a href="#/host/my-games">Minu mängud</a></h3>
  <h3><a href="#/host/game-history">Mängude ajalugu</a></h3>
</div>

<style>
</style>
