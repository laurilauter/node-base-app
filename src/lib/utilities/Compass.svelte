<script>
  // @ts-nocheck
  import Navigation from "svelte-material-icons/Navigation.svelte";

  let orientation;
  let absolute;

  function handleOrientation(event) {
    orientation = Math.trunc(event.alpha);
    absolute = event.absolute;
  }
  window.addEventListener("deviceorientation", handleOrientation);
</script>

{#if absolute}
  <div on:deviceorientation={handleOrientation}>
    <span>Device orientation: {orientation} absolute: {absolute}</span>
    <div style="rotate: {orientation}deg;">
      <Navigation
        size={"2rem"}
        ariaHidden={false}
        horizontal
        color={"#ff0033"}
      />
    </div>
  </div>
{/if}

<style>
</style>
