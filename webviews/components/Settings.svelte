<script lang="ts">
  import { onMount } from "svelte";
  import type { User, Activity } from "../types";

  export let user: User;
  export let activities: Activity[];

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });

  /* ---------------------- Format Date to Readable form ---------------------- */
  function renderDate(val: string | number | Date): string {
    const date = new Date(val);
    return date.toDateString() + " @ " + date.toLocaleTimeString();
  }
</script>

<div class="settings">
  <div class="notifications">
    <h3>Team Requests</h3>
    {#each user.__teamsIn__.filter((t) => {
      return t.status == "pending";
    }) as teamIn}
      <ul>
        <li>{teamIn.team_name}</li>
      </ul>
    {:else}
      <p class="error">
        You have not been added to any Team lately. Pending Team Requests will
        display here..
      </p>
    {/each}
  </div>

  <div class="featured-teams">
    <h3>Featured Teams</h3>
    {#each user.__teamsIn__.filter((t) => {
      return t.status == "accepted";
    }) as teamIn}
      <ul>
        <li>{teamIn.team_name}</li>
      </ul>
    {:else}
      <p class="error">
        You are not part of any team yet, Teams which you're a member of will
        display here.
      </p>
    {/each}
  </div>

  <div class="recent-activities">
    <h3>Recent Activities</h3>
  </div>

  {#each activities as activity}
    <!-- content here -->
    <p>{activity.message}</p>
  {/each}
</div>

<style scoped>
  .settings {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .error {
    color: #ff8c00;
  }

  .notifications {
    margin-top: 0px;
  }

  .notifications h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .featured-teams {
    margin-top: 20px;
  }

  .featured-teams h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .recent-activities {
    margin-top: 20px;
  }

  .recent-activities h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }
</style>
