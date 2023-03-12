<script>
  // @ts-nocheck

  import Navigation from "svelte-material-icons/Navigation.svelte";

  let orientation = 0;

  function handleOrientation(event) {
    orientation = Math.trunc(event.alpha);
  }
  window.addEventListener("deviceorientation", handleOrientation);
</script>

<div on:deviceorientation={handleOrientation}>
  <span>Device orientation: {orientation}</span>
  <span>
    <!-- <Navigation
      size={"2rem"}
      ariaHidden={false}
      rotate={orientation}
      color={"#ff0000"}
    /> -->
    <Navigation
      size={"2rem"}
      ariaHidden={false}
      horizontal
      rotate={orientation}
      color={"#ff0033"}
    />
  </span>
</div>

<style>
</style>
