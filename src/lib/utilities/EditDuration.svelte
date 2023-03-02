<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";

  // Icon properties
  export let size = "1em"; // string | number
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
      dispatch("submitDuration", value);
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
    <span>Kestus </span><input
      bind:value
      on:blur={submit}
      {required}
      use:focus
    /> <span>min</span>
  </form>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->

  <span>Kestus </span>
  {value} <span>min</span>
  <span>
    <span class="link-button" on:click={edit} on:keypress>
      <Pencil {size} {ariaHidden} />
    </span>
  </span>
{/if}

<style>
  input {
    max-width: 60px;
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
  }
</style>
