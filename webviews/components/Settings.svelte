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

  /* -------------------------- Dispatch Mark as Read ------------------------- */
  function markAsRead(id: number) {
    dispatch("markasread", id);
  }
  /* ---------------------- Format Date and Display Activity Date ---------------------- */
  function renderActivityDate(val: number) {
    var date = new Date();
    var millis = date.valueOf() - val;
    var hour = Math.floor((millis / 3600 / 1000) % 24);
    var minute = Math.floor((millis / 60000) % 60);
    var seconds = ((millis % 60000) / 1000).toFixed(0);

    if (hour >= 1 && hour <= 24) {
      return hour + " hr";
    } else if (hour == 0 && minute >= 1) {
      return minute + " min";
    } else if (minute == 0 && hour == 0) {
      return seconds + " sec";
    }
  }
</script>

<div class="settings">
  <div class="team-request-in">
    <h3>Team Requests (Incoming)</h3>
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

  <div class="team-request-out">
    <h3>Team Requests (Outgoing)</h3>
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
    <h3>
      Recent Activities - <span
        >{activities.filter((a) => a.read == false).length}</span
      >
    </h3>
  </div>

  <div class="activities-container">
    {#each activities as activity, id}
      <!-- content here -->
      {#if id <= 14}
        <!-- content here -->
        <div
          class={activity.read ? "activity read" : "activity unread"}
          on:click={() => markAsRead(id)}
        >
          <div class="activity-icon">
            {#if activity.flair !== undefined}
              <i class="icon-flair fa fa-code" />
            {/if}
            {#if activity.team !== undefined}
              <i class="icon-team fa fa-user-friends" />
            {/if}
            {#if activity.project !== undefined}
              <i class="icon-project fa fa-project-diagram" />
            {/if}
          </div>
          <div class="activity-message">
            {#if activity.flair !== undefined}
              <h3>{activity.title}</h3>
              <p>
                Flair Name <span>{activity.flair}</span> was created successfully.
              </p>
            {/if}
            {#if activity.team !== undefined}
              <h3>{activity.title}</h3>
              <p>
                Team Name <span>{activity.team}</span> was created successfully.
              </p>
            {/if}
            {#if activity.project !== undefined}
              <h3>{activity.title}</h3>
              <p>
                Project Name <span>{activity.project}</span> was created successfully.
              </p>
            {/if}
          </div>
          <div class="activity-date">
            <span>{renderActivityDate(activity.date)} ago</span>
          </div>
        </div>
      {/if}
    {:else}
      <p>No Recent Activity</p>
    {/each}
  </div>
</div>

<style scoped>
  .settings {
    display: flex;
    padding-left: 3px;
    flex-direction: column;
    justify-content: start;
  }

  .error {
    color: #ff8c00;
  }

  .team-request-in {
    margin-top: 0px;
  }

  .team-request-in h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .team-request-out {
    margin-top: 20px;
  }

  .team-request-out h3 {
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

  .recent-activities h3 span {
    color: red;
  }

  .activities-container {
    background-color: #1a1919;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    max-height: 300px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    overflow-y: scroll;
  }

  .activity {
    display: flex;
    flex-direction: row;
    justify-content: start;
    width: 100%;
    border-radius: 20px;
    height: 80px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    cursor: pointer;
  }

  .read {
    background-color: #e7e7e7;
  }

  .unread {
    background-color: #fff;
    border-top: 2px solid rgb(255, 140, 0);
  }

  .activity-icon {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .icon-team {
    padding: 6px;
    background-color: rgba(255, 140, 0, 0.8);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  .icon-flair {
    padding: 6px;
    background-color: rgb(14, 99, 156, 0.8);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  .icon-project {
    padding: 6px;
    background-color: rgba(14, 156, 14, 0.8);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  .activity-message {
    width: 70%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding-left: 3px;
  }

  .activity-message h3 {
    font-size: 1rem;
    color: #1a1919;
    font-weight: bold;
  }

  .activity-message p {
    margin-top: 5px;
    color: rgb(26, 25, 25, 0.5);
    font-size: 0.8rem;
  }

  .activity-message p span {
    font-weight: bold;
    font-style: italic;
  }

  .activity-date {
    width: 15%;
    height: 100%;
    /* background-color: green; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .activity-date span {
    font-size: 0.6rem;
    color: #1a1919;
  }
</style>
