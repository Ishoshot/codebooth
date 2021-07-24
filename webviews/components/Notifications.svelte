<script lang="ts">
  import { onMount } from "svelte";
  import type { User, Activity, TeamMember } from "../types";

  export let accessToken: string;
  // export let user: User;
  export let activities: Activity[];

  let filteredActivities: Activity[] = activities;
  let filterClass: string = "all";

  // Function to Mark Activity As Read
  async function markAsRead(id: string) {
    const response = await fetch(`${apiBaseURL}/user/activity/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data: any = await response.json();
    // console.log(data);
    if (response.status !== 200) {
      tsvscode.postMessage({
        type: "onError",
        value: "Oops! Error Encountered - Cannot Mark Activity as Read",
      });
      return;
    }

    // Update Activities and Filters
    activities = activities.map((activity) =>
      activity.id === data.activity.id
        ? { ...activity, read_at: true }
        : activity
    );
    filteredActivities = activities;
    filterClass = "all";

    tsvscode.postMessage({
      type: "onInfo",
      value: `Activity Marked as Read Successfully`,
    });
  }

  // Format Date and Display Activity Date
  function renderActivityDate(val: any) {
    var date = new Date();
    var millis = date.valueOf() - new Date(val).valueOf();
    var week = Math.floor(millis / (1000 * 60 * 60 * 24 * 7));
    var day = Math.floor((millis / (1000 * 60 * 60 * 24)) % 7);
    var hour = Math.floor((millis / 3600 / 1000) % 24);
    var minute = Math.floor((millis / 60000) % 60);
    var seconds = ((millis % 60000) / 1000).toFixed(0);

    if (week > 0) {
      return week + " week" + (week > 1 ? "s" : "");
    } else if (day >= 1 && day <= 7) {
      return day + " day" + (day > 1 ? "s" : "");
    } else if (hour >= 1 && hour <= 24) {
      return hour + " hr" + " " + minute + " min";
    } else if (hour == 0 && minute >= 1) {
      return minute + " min";
    } else if (minute == 0 && hour == 0) {
      return seconds + " sec";
    }
  }

  async function filterActivities(type: string) {
    if (type == "all") {
      filterClass = "all";
      filteredActivities = activities.filter((a) => a.id != null);
    } else if (type == "unread") {
      filterClass = "unread";
      filteredActivities = activities.filter((a) => a.read_at == false);
    } else {
      filterClass = "read";
      filteredActivities = activities.filter((a) => a.read_at == true);
    }
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  onMount(async () => {
    filteredActivities = activities;
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<!-- svelte-ignore missing-declaration -->
<div class="notifications">
  <!-- Recent Activities -->
  <div class="recent-activities">
    <h3>Your Recent Activities</h3>
    {#if activities.filter((a) => a.read_at == false).length > 0}
      <p class="unreadActivities">
        You have {activities.filter((a) => a.read_at == false).length} / {activities.length}
        unread activities
      </p>

      <!-- Filters -->
      <div class="filters">
        <p>
          <i class="fa fa-filter" /> Filter:
        </p>

        <div class="filters-row">
          <span
            class={filterClass == "all" ? "active" : ""}
            on:click={() => filterActivities("all")}
          >
            ALL
          </span>
          <span
            class={filterClass == "read" ? "active" : ""}
            on:click={() => filterActivities("read")}
          >
            READ
          </span>
          <span
            class={filterClass == "unread" ? "active" : ""}
            on:click={() => filterActivities("unread")}
          >
            UNREAD
          </span>
        </div>
      </div>
    {/if}

    <div class="activities-container">
      {#each filteredActivities as activity, id}
        <div
          class={activity.read_at ? "activity read" : "activity unread"}
          on:click={() => {
            if (!activity.read_at) {
              markAsRead(activity.id);
            }
          }}
        >
          <div class="activity-icon">
            {#if activity.entity == "Flair"}
              <i class="fa fa-heart" id={activity.action} />
            {/if}
          </div>

          <div class="activity-message">
            <h3>{activity.title}</h3>
            <p>
              {activity.description}
            </p>
          </div>

          <div class="activity-date">
            <span>{renderActivityDate(activity.created_at)} ago</span>
          </div>
        </div>
      {:else}
        <p class="error">No Recent Activity</p>
      {/each}
    </div>
  </div>
</div>

<style scoped>
  .notifications {
    display: flex;
    padding-left: 0.5rem;
    flex-direction: column;
    justify-content: start;
  }

  .unreadActivities {
    margin-top: 0.6rem;
    margin-bottom: 1rem;
  }

  .recent-activities {
    margin-top: 1rem;
  }

  .recent-activities h3 {
    font-weight: bold;
  }

  .activities-container {
    background-color: inherit;
    /* padding-left: 0.5rem; */
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    max-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    overflow-y: auto;
  }

  .activity {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 100%;
    border-radius: 15px;
    min-height: 65px;
    margin-top: 5px;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .read {
    background-color: var(--vscode-button-secondaryBackground);
  }

  .unread {
    background-color: var(--vscode-button-secondaryHoverBackground);
    border-right: 2px solid var(--vscode-button-background);
  }

  .activity-icon {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  /* .icon-flair {
    padding: 0.55rem;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-size: 1rem;
    border-radius: 50%;
  } */

  #Delete {
    padding: 0.55rem;
    background-color: #dd2d27;
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  #Create {
    padding: 0.55rem;
    background-color: #0eb90e;
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  .activity-message {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding-left: 5px;
  }

  .activity-message h3 {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--vscode-button-secondaryForeground);
  }

  .activity-message p {
    margin-top: 5px;
    font-size: 0.75rem;
    color: var(--vscode-button-secondaryForeground);
  }

  .activity-date {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .activity-date span {
    font-size: 0.6rem;
    color: var(--vscode-button-secondaryForeground);
  }

  .filters {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
  }

  .filters-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .filters-row span {
    margin-left: 20px;
    cursor: pointer;
  }

  .active {
    font-weight: bold;
  }
</style>
