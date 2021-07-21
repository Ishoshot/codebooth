<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { Flair, User } from "../../types";

  export let flairs: Flair[];
  export let creatingFlair: boolean;

  const dispatch = createEventDispatcher();

  let flairSynopsis: boolean = false;

  // Tell SideBarProvider to Show Flair Dialog Box
  function showFlairDialog() {
    tsvscode.postMessage({
      type: "create-flair",
      value: undefined,
    });
  }

  // Send Delete Flair Action to SideBar
  function deleteFlair(flair: any) {
    dispatch("deleteflair", flair);
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
        class={flairSynopsis
          ? "fa fa-caret-up question"
          : "fa fa-caret-down question"}
        style="margin-left: 10px"
        on:click={() => {
          flairSynopsis = !flairSynopsis;
        }}
      />
    </h3>

    {#if flairSynopsis}
      <!-- Show Flair Synopsis -->
      <br />
      <p class="synopsis">
        A Flair represents one of your fav programming languages. Basically, It
        describes you and is visible to the public.
      </p>
    {/if}
  </div>
  <div class="inner">
    <div class="flairs-row">
      {#each flairs as flair}
        <!-- Display Flairs -->
        <span class="flairItem">
          {flair.name}
          <i
            class="delete fa fa-trash"
            on:click={() => deleteFlair(flair.id)}
          />
        </span>
      {:else}
        <!-- Flair's Empty -->
        <h4>Oops! 😔 No Flair(s) found...</h4>
      {/each}
    </div>

    <!-- Add New Flair -->
    {#if creatingFlair}
      <!-- Flair Loading -->
      <div class="load">
        <i class="text-center fa fa-spinner fa-spin" />
      </div>
    {:else}
      <!-- Button to Trigger Dialog -->
      <button class="addFlair" on:click={() => showFlairDialog()}
        >Add new Flair</button
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

  .wrapper h3 span {
    color: #ff8c00;
    margin-right: 6px;
    font-weight: bold;
  }

  .head {
    margin-bottom: 0.5rem;
  }

  .question {
    cursor: pointer;
  }

  .synopsis {
    font-size: 0.85rem;
  }

  .addFlair {
    margin-top: 2rem;
  }

  .flairItem {
    background-color: var(--vscode-button-secondaryBackground);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1.1rem;
    padding-right: 1.1rem;
    margin-right: 0.6rem;
    border-radius: 1rem;
    margin-top: 1rem;
    cursor: pointer;
  }

  .flairItem:hover {
    background: var(--vscode-button-secondaryHoverBackground);
  }

  .load {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .delete {
    margin-left: 0.3rem;
    color: #c02222;
  }
</style>
