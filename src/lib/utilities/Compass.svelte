<script>
  // @ts-nocheck

  import Navigation from "svelte-material-icons/Navigation.svelte";

  let orientation;

  function handleOrientation(event) {
    orientation = Math.trunc(event.alpha);
  }
  window.addEventListener("deviceorientation", handleOrientation);
</script>

<div on:deviceorientation={handleOrientation}>
  <span>Device orientation: {orientation}</span>
  <Navigation
    size={"2rem"}
    ariaHidden={false}
    horizontal
    rotate={orientation}
    color={"#ff0033"}
  />
  <div style="rotate: {orientation}deg;">
    <Navigation size={"2rem"} ariaHidden={false} horizontal color={"#ff0099"} />
  </div>
</div>

<style>
</style>
