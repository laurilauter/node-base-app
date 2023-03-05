<script>
  import LogOutFunc from "./utilities/LogOutFunc.svelte";
  let logOutGetter;
</script>

<div class="row-container">
  <div>
    <slot />
  </div>
  <div>
    <button class="link-button" on:click={logOutGetter.logout()}
      >Logi välja</button
    >
  </div>
</div>
<LogOutFunc bind:this={logOutGetter} />

<style>
</style>
