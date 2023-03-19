<script>
  import { closeModal } from "svelte-modals";
  import QRCode from "../QRJS.svelte";
  import CloseCircleOutline from "svelte-material-icons/CloseCircleOutline.svelte";

  // provided by <Modals />
  export let isOpen;
  export let code;
  function print() {
    window.print();
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="close-div no-print">
        <span class="close" on:click={closeModal} on:keypress>
          <CloseCircleOutline size={"3rem"} ariaHidden={false} />
        </span>
      </div>
      <span>
        <QRCode codeValue={code} squareSize="360" />
      </span>
      <span>{code}</span>
      <!-- <button on:click={window.print()}>PRINT</button> -->
      <div class="actions no-print">
        <!-- <button on:click={closeModal}>OK</button> -->
        <button on:click={print}>PRINT</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 364px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }

  .close {
    color: grey;
    border-radius: 0;
    border: 0px solid transparent;
    font-family: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  .close-div {
    display: flex;
    justify-content: end;
  }

  @media print {
    div,
    span {
      border: none;
    }
  }

  @page {
    margin: 2cm 2cm 0 2cm;
  }
</style>
