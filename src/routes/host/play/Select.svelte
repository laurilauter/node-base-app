<script>
  export let options = [];
  export let display_func = (a) => a;
  export let index = 0;
  export let value;

  $: {
    value = options[index];
    console.log(value);
  }
</script>

<div class="select">
  <select bind:value={index}>
    {#each options as option, i}
      <option value={i}>{display_func(option)}</option>
    {/each}
  </select>
</div>

<style>
  .select {
    width: 300px;
  }
  select {
    color: rgb(72, 72, 72);
    font-size: 1em;
    background-color: var(--main-color);
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid var(--input-border-color);
    box-sizing: border-box;
    border-radius: 9px;
  }
</style>
