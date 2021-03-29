<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { User } from "../../types";

  export let user: User;
  export let creatingFlair: boolean;

  const dispatch = createEventDispatcher();

  let flairSynopsis: boolean = false;

  /* ------------------------------ Show Flair Dialog Box ------------------------------ */
  function showFlairDialog() {
    tsvscode.postMessage({
      type: "create-flair",
      value: undefined,
    });
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<div class="wrapper">
  <!-- Flair List -->
  <div class="head">
    <h3>
      <span class="fa fa-plus" />My Flairs
      <i
        class="fa fa-question"
        style="margin-left: 10px"
        on:click={() => {
          flairSynopsis = !flairSynopsis;
        }}
      />
      {#if flairSynopsis}
        <!-- Show Flair Synopsis -->
        <br />
        <p class="synopsis">
          Flairs are identified as your favourite programming languages. They
          basically describe you and they are visible to the public.
        </p>
      {/if}
    </h3>
  </div>
  <div class="inner">
    <div class="flairs-row">
      {#each user.__flairs__.reverse() as flair}
        <!-- Display Flairs -->
        <span class="flairItem">{flair.name}</span>
      {:else}
        <!-- Flair's Empty -->
        <h4>Oops 😔 ! No Flair found...</h4>
      {/each}
    </div>

    <!-- Add New Flair -->
    {#if creatingFlair}
      <!-- Flair Loading -->
      <i class="fa fa-spinner fa-spin fa-fw" />
    {:else}
      <!-- Button to Trigger Dialog -->
      <button class="addFlair" on:click={() => showFlairDialog()}
        >Add Flair</button
      >
    {/if}
  </div>
</div>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-top: 10%;
    margin-bottom: 10%;
    padding-left: 7%;
    padding-right: 7%;
  }

  .inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }

  .flairs-row {
    display: flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    align-items: start;
  }

  .wrapper h4 {
    color: #fff;
  }

  .wrapper h3 span {
    color: #ff8c00;
    margin-right: 6px;
    font-weight: bold;
  }

  .head {
    margin-bottom: 4%;
  }

  .synopsis {
    margin-top: 10px;
    color: #f9f9f9;
    font-size: 0.8rem;
  }

  .addFlair {
    margin-top: 7%;
  }

  .flairItem {
    background-color: #cfcfcf;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 12px;
    padding-right: 12px;
    color: #111;
    /* margin-left: 10px; */
    margin-right: 10px;
    border-radius: 20px;
    margin-top: 10px;
    cursor: pointer;
  }
</style>
