<script>
  import LogOutFunc from "./utilities/LogOutFunc.svelte";
  let logOutGetter;
</script>

<div class="row-container">
  <div>
    <slot />
  </div>
  <div class="logout">
    <button class="logout-button" on:click={logOutGetter.logout()}
      >Logi välja</button
    >
  </div>
</div>
<LogOutFunc bind:this={logOutGetter} />

<style>
  .logout {
    width: fit-content;
  }

  .logout-button {
    color: var(--link-color);
    border-radius: 0;
    border: 0px solid transparent;
    font-size: 1em;
    font-weight: 400;
    font-family: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  .logout-button:hover {
    color: var(--link-hover-color);
  }
</style>
