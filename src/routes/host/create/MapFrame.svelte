<script>
  export let mapMarkers;
</script>

<div class="map-box">
  <slot />
</div>
<div>
  {#each mapMarkers as marker}
    <p>{marker}</p>
  {:else}
    <h3>Küsimused puuduvad</h3>
  {/each}
</div>

<style>
  .map-box {
    border: none;
    border-radius: 9px;
    max-width: 600px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
