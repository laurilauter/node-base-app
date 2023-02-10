<script>
  import { navigate } from "svelte-routing";
  export let id;

  // make a request to db to check if there is an active game with the given id
  //if yes ask for a name
  //otherwise say link expired

  if (!id) {
    console.log("no id");
    navigate("/");
  }

  import axios from "axios";

  let name;
  let message;

  async function setPlayerName() {
    try {
      const data = {
        name: name,
      };

      const response = await axios.post(`/join/${id}`, data);
      const responseData = response.data;
      message = responseData.message;
      console.log("data ", responseData.message);
    } catch (error) {
      message = error.response.data.error;
      console.log("error ", error);
    }
  }
</script>

<div class="row-container">
  <div class="column-container">
    <form action="" method="post">
      <input
        type="text"
        placeholder="Enter Name"
        name="name"
        bind:value={name}
        required
      />
      <button type="button" id="join-button" on:click={setPlayerName}
        >Join game</button
      >
      <p>
        {#if message}
          {message}
        {/if}
      </p>
    </form>

    <br />
    <p>Id from URL here: {id}</p>
  </div>
</div>

<style>
  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
  }

  .column-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
