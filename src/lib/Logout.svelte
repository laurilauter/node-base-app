<script>
  import LogOutFunc from "./utilities/LogOutFunc.svelte";
  let logOutGetter;
</script>

<div class="row-container">
  <slot />
  <button class="link-button" on:click={logOutGetter.logout()}
    >Logi välja</button
  >
  <LogOutFunc bind:this={logOutGetter} />
</div>

<style>
</style>
