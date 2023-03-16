<script>
  import baseURL from "../../../lib/utilities/baseUrl";
  import Loader from "../../../lib/utilities/Loader.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isUserLoggedIn } from "../../../stores.js";
  import { sessionUserInfo } from "../../../stores.js";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import InPlaceEdit from "../../../lib/utilities/InPlaceEdit.svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";

  let qrCodes = [];
  let currentCode;

  async function createCode() {
    const response = await fetch(`${baseURL}/qr/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        qrCodeTitle: "QR nimi",
        ownerId: $sessionUserInfo.id,
      }),
    });

    const responseData = await response.json();
    // session = responseData.session;
    // error = responseData.error;
    console.log("responseData at ADD QR", responseData);
    getCodes();
  }

  async function getCodes() {
    const response = await fetch(`${baseURL}/qr/list/${$sessionUserInfo.id}`);
    console.log("$sessionUserInfo.id ", $sessionUserInfo.id);
    qrCodes = await response.json();
    console.log("qrCodes ", qrCodes);
    console.log("isUserLoggedIn at MyGamePlans ", $isUserLoggedIn);
  }

  function submit(field) {
    return ({ detail: newValue }) => {
      const fragments = field.split("-");
      const codeId = fragments[0];
      const codeTitle = fragments[1];
      console.log("fragments ", fragments);
      console.log("newValue ", newValue);
      (async () => {
        try {
          const response = await fetch(`${baseURL}/qr/update/${codeId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              qrCodeTitle: codeTitle,
            }),
          });
          let updatedCode = await response.json();
          console.log("updatedCode ", updatedCode);
        } catch (error) {
          console.log({ error: error });
        }
      })();
    };
    getCodes();
  }

  onMount(async () => {
    getCodes();
  });
</script>

<div in:fade={{ duration: 1000 }}>
  <h1>Minu QR koodid</h1>
  <div>
    <ul>
      {#each qrCodes as code}
        <li>
          <span class="link-text">
            <InPlaceEdit
              bind:value={code.qrCodeTitle}
              on:submit={submit(`${code._id}-${code.qrCodeTitle}`)}
            >
              <Pencil size={"1rem"} ariaHidden={false} />
            </InPlaceEdit>
          </span>
          <span>PRINT</span>
          <span>DELETE</span>
          <span>{code.qrCodeImage}</span>
        </li>
      {:else}
        <Loader />
      {/each}
    </ul>
    <span class="link-button" on:click={createCode} on:keypress>
      <PlusCircleOutline size={"2rem"} ariaHidden={false} />
    </span>
  </div>
</div>

<style>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
</style>
