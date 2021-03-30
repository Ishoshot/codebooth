<script lang="ts">
  import { onMount } from "svelte";
  import type { User, Activity, TeamMember } from "../types";

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

  /* ---------------------- Dispatch Remove User form Team ---------------------- */
  function leaveTeam(team: TeamMember) {
    dispatch("leaveteam", team);
  }

  /* ---------------------- Dispatch Update Team ---------------------- */
  function updateTeamRequest(team: TeamMember, type: number) {
    let data;
    if (type == 0) {
      data = {
        team: team,
        status: "rejected",
        request_seen: true,
      };
    } else if (type == 1) {
      data = {
        team: team,
        status: "accepted",
        request_seen: true,
      };
    } else {
      data = {
        team: team,
        status: "pending",
        request_seen: true,
      };
    }
    dispatch("updateteamrequest", data);
  }

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

<div class="notifications">
  <div class="team-request-in">
    <h3>
      Incoming Team Requests
      {#if user.__teamsIn__.filter((t) => {
        return t.status == "pending" && t.request_seen == false;
      }).length > 0}
        <span class="red">
          - {user.__teamsIn__.filter((t) => {
            return t.status == "pending" && t.request_seen == false;
          }).length}</span
        >
      {/if}
    </h3>
  </div>

  <div class="featuredTeams-container">
    {#each user.__teamsIn__.filter((t) => {
      return t.status == "pending";
    }) as teamIn}
      <div
        class={teamIn.request_seen
          ? "featuredTeam read"
          : "featuredTeam unread"}
        on:click={() => {
          updateTeamRequest(teamIn, 3);
        }}
      >
        <div class="featuredTeam-icon">
          <i class="icon-project fa fa-user-friends" />
        </div>
        <div class="featuredTeam-message">
          <h2>{teamIn.team_name}</h2>
          <p>You have been invited to join this team.</p>
        </div>
        <div class="featuredTeam-col">
          <span
            class="accept fa fa-check-circle"
            on:click={() => {
              updateTeamRequest(teamIn, 1);
            }}
          />
          <span
            class="reject fa fa-times-circle"
            on:click={() => {
              updateTeamRequest(teamIn, 0);
            }}
          />
        </div>
      </div>
    {:else}
      <p class="error">
        You have not been added to any Team lately. Your Pending Incoming Team
        Requests will display here..
      </p>
    {/each}
  </div>
  <!-- Incoming Team Request Ends -->

  <!-- Outgoing Team Request  -->
  <div class="team-request-out">
    <h3>Outgoing Team Requests</h3>
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
  <!-- Outgoing Team Request Ends  -->

  <!-- Recent Activities -->
  <div class="recent-activities">
    <h3>
      Recent Activities
      {#if activities.filter((a) => a.read == false).length > 0}
        <span> - {activities.filter((a) => a.read == false).length}</span>
      {/if}
    </h3>
  </div>

  <div class="activities-container">
    {#each activities as activity, id}
      {#if id <= 14}
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
      <p class="error">No Recent Activity</p>
    {/each}
  </div>
  <!-- Recent Activities Ends -->

  <!-- Featured Teams -->
  <div class="featured-teams">
    <h3>Featured Teams</h3>
  </div>

  <div class="featuredTeams-container">
    {#each user.__teamsIn__.filter((t) => {
      return t.status == "accepted";
    }) as teamIn}
      <div class="featuredTeam">
        <div class="featuredTeam-icon">
          <i class="icon-team fa fa-user-friends" />
        </div>
        <div class="featuredTeam-message">
          <h2>{teamIn.team_name}</h2>
          <p>
            joined: <span>{renderDate(teamIn.updated_at)}.</span>
          </p>
        </div>
        <div class="featuredTeam-leave">
          <span
            class="fa fa-sign-out-alt"
            on:click={() => {
              leaveTeam(teamIn);
            }}
          />
        </div>
      </div>
    {:else}
      <p class="error">
        You are not part of any team yet, Teams which you're a member of, will
        display here.
      </p>
    {/each}
  </div>

  <!-- Featured Teams Ends -->
</div>

<style scoped>
  .notifications {
    display: flex;
    padding-left: 3px;
    flex-direction: column;
    justify-content: start;
  }

  .error {
    color: #ff8c00;
  }

  .team-request-in {
    margin-top: 10px;
  }

  .team-request-in h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .team-request-out {
    margin-top: 40px;
  }

  .team-request-out h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .featured-teams {
    margin-top: 40px;
  }

  .featured-teams h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .recent-activities {
    margin-top: 40px;
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
    height: 70px;
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

  .featuredTeams-container {
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

  .featuredTeam {
    background-color: #e7e7e7;
    display: flex;
    flex-direction: row;
    justify-content: start;
    width: 100%;
    border-radius: 20px;
    height: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    cursor: pointer;
  }

  .featuredTeam-icon {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .featuredTeam-message {
    width: 70%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding-left: 3px;
  }

  .featuredTeam-message h2 {
    font-size: 1rem;
    color: #1a1919;
    font-weight: bold;
  }

  .featuredTeam-message p {
    margin-top: 5px;
    color: rgba(26, 25, 25, 0.5);
    font-size: 0.8rem;
  }

  .featuredTeam-message p span {
    font-weight: bold;
    font-style: italic;
  }

  .featuredTeam-leave {
    width: 15%;
    height: 100%;
    /* background-color: green; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .featuredTeam-leave span {
    font-size: 0.9rem;
    color: #1a1919;
  }

  .featuredTeam-col {
    width: 15%;
    height: 100%;
    /* background-color: green; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .featuredTeam-col .accept {
    font-size: 1.1rem;
    color: green;
  }

  .featuredTeam-col .reject {
    font-size: 1.1rem;
    margin-top: 5px;
    color: red;
  }

  .red {
    color: red;
  }
</style>
