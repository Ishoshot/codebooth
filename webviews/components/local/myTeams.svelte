<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { Team } from "../../types";
  import type { User } from "../../types";

  export let user: User;
  export let creatingTeam: boolean;

  const dispatch = createEventDispatcher();

  /* ------------------------------ Show Flair Dialog Box ------------------------------ */
  function showTeamDialog() {
    tsvscode.postMessage({
      type: "create-team",
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
      <span class="fa fa-plus" />My Teams
    </h3>
  </div>
  <div class="inner">
    {#each user.__teams__.reverse() as team, sn}
      <!-- Display Teams -->
      <div class="teams-row">
        <span class="TeamItem">{sn + 1}. {team.name}</span>
      </div>
    {:else}
      <!-- Team's Empty -->
      <h4>Oops 😔 ! You need to create your first Team.</h4>
    {/each}

    <!-- Add New Team -->
    {#if creatingTeam}
      <!-- Team Loading -->
      <i class="fa fa-spinner fa-spin" style="text-align:center" />
    {:else}
      <!-- Button to Trigger Dialog -->
      <button class="addTeam" on:click={() => showTeamDialog()}>Add Team</button
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
    justify-content: start;
    align-items: flex-start;
  }

  .teams-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 5px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
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

  .addTeam {
    margin-top: 7%;
  }

  .TeamItem {
    color: #fff;
    cursor: pointer;
  }
</style>
