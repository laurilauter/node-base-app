<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let value,
    required = true;

  const dispatch = createEventDispatcher();
  let editing = false,
    original;

  onMount(() => {
    original = value;
  });

  function edit() {
    editing = true;
  }

  function submit() {
    if (value != original) {
      dispatch("submit", value);
    }

    editing = false;
  }

  function keydown(event) {
    if (event.key == "Escape") {
      event.preventDefault();
      value = original;
      editing = false;
    }
  }

  function focus(element) {
    element.focus();
  }
</script>

{#if editing}
  <form on:submit|preventDefault={submit} on:keydown={keydown}>
    <input
      bind:value
      on:blur={submit}
      {required}
      use:focus
      size={value.length}
    />
  </form>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="value-div" on:click={edit}>
    {value}
    <span>
      <slot />
    </span>
  </div>
{/if}

<style>
  /* .input-div {
    width: fit-content;
  } */
  .value-div {
    margin: 0 5px 0 5px;
  }

  .value-div > span {
    margin-left: 5px;
  }

  input {
    width: 100%;
    border: none;
    background: var(--main-bg-color);
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
    margin: 0 5px 0 5px;
  }
</style>
