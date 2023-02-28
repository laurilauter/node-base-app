<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";

  // Icon properties
  export let size = "0.6em"; // string | number
  export let ariaHidden = false; // boolean

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
      dispatch("submitTitle", value);
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
    <input bind:value on:blur={submit} {required} use:focus />
  </form>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div>
    {value}
  </div>
  <span class="link-button" on:click={edit} on:keypress>
    <Pencil {size} {ariaHidden} />
  </span>
{/if}

<style>
  input {
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
  }
</style>
