<script>
  // @ts-nocheck
  import Navigation from "svelte-material-icons/Navigation.svelte";

  let direction;
  function handleDirection(event) {
    direction = event.alpha;
  }
</script>

<div on:deviceorientation={handleDirection}>
  <h1>Kaart</h1>
  <span>Device direction:</span>
  <span>{direction}</span>
  <span>
    <Navigation
      size={"2rem"}
      ariaHidden={false}
      rotate={direction}
      color={"#ff0000"}
    />
  </span>

  <div>
    <p>
      1. First this should display some spinner indicating that players are
      gathering
    </p>
    <p>2. Game will start when the game leader starts it</p>
    <p>3. Game ends when the game leader ends it, or game time is up.</p>
    <p>
      4. Alternatively the player can leave leave and come back with the same
      game code to continue.
    </p>
  </div>
</div>

<style>
</style>
