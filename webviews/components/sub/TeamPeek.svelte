<script lang="ts">
  import { onMount } from "svelte";
  import type { Team, User } from "../../types";

  export let team: Team;
  export let user: User;
  export let accessToken: string;

  let userToAdd: User | null = null;
  let users: Array<User> = [];

  let loading: boolean = true;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Call Mail Service
  async function callTeamMailService(team: Team, user: string, member: User) {
    const teamData = {
      teamName: team.name,
      teamDesc: team.description,
      members: team.__members__.filter((t) => {
        return t.status == "accepted";
      }).length,
      projects: team.__projects__.length,
      user: {
        name: team.__user__.name,
        isVerified: team.__user__.verified,
      },
      member: {
        name: member.name,
        isVerified: member.verified,
      },
    };
    const response = await fetch(`${serviceBaseURL}/team/addUser`, {
      method: "POST",
      body: JSON.stringify({
        team: teamData,
        user,
        member: member.email,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${serviceToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
  }

  /* ----------------------------- Trigger Add User ----------------------------- */
  async function addUserToTeam(team: Team) {
    if (userToAdd === null) {
      tsvscode.postMessage({
        type: "onError",
        value: "User cannot be Empty! Please Choose a user to add.",
      });
      return;
    } else {
      const response = await fetch(`${apiBaseURL}/team/add-user`, {
        method: "POST",
        body: JSON.stringify({
          team_id: team.id,
          team_name: team.name,
          user_id: userToAdd.id,
        }),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.teamMember === null) {
        tsvscode.postMessage({
          type: "onError",
          value:
            "Error Encountered while Adding User. Possible Reason: User Already Exists in the Team",
        });
        return;
      } else {
        callTeamMailService(team, team.__user__.email, userToAdd);
        /* ------------ Show success Message and Return Token for webview Refresh ----------- */
        tsvscode.postMessage({
          type: "onAddUserToTeam",
          value:
            "A Request Has been sent to the User... Check your e-Mail for info",
        });

        dispatch("addUserToTeam");
      }
    }
  }

  /* -------------------------------- Get Users ------------------------------- */
  async function getUsers() {
    const response = await fetch(`${apiBaseURL}/users-light`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json();
    users = payload.users;
    loading = false;
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
    // Get Users to Populate DropDown
    getUsers();
  });

  /* ---------------------- Format Date to Readable form ---------------------- */
  function renderDate(val: string | number | Date): string {
    const date = new Date(val);
    return date.toDateString() + " @ " + date.toLocaleTimeString();
  }
</script>

{#if !loading}
  <div class="profile">
    <!-- First Widget -->
    <div class="first">
      <div class="image">
        <div class="img-primary"><h1>{team.name.slice(0, 2)}</h1></div>
        <div class="img-secondary">
          <img src={team.__user__.image} alt="avatar" />
        </div>
      </div>
      <p class="name">
        {team.name}
      </p>
      <p class="bio">
        Owner: {team.__user__.name}
        <span class="fa fa-star" style="margin-left:5px;">
          {team.__user__.__stars__.length}
        </span>
      </p>

      {#if user.id == team.__user__.id}
        <p class="bio">Created: {renderDate(team.__user__.created_at)}</p>
      {/if}
    </div>

    <!-- Projects -->
    <div class="second">
      <div class="primary-container">
        <h3>PROJECTS</h3>
        <div class="primary">
          <p>Number of Projects: {team.__projects__.length}</p>
          {#each team.__projects__.reverse() as project, sn}
            <p class="item">{sn + 1}. {project.name}</p>
          {:else}
            <h4 class="error">Oops! This Team has no Project(s)</h4>
          {/each}
        </div>
      </div>
    </div>

    <div class="second">
      <div class="primary-container">
        <!-- Add user -->
        {#if user.id == team.__user__.id}
          <h3 style="margin-bottom:10px;">Add New Member</h3>
          <form class="addUser-form">
            <select
              name="user"
              placeholder="Search For User"
              bind:value={userToAdd}
              id="user"
            >
              <option value="">~ Please Select ~</option>
              {#each users.filter((u) => {
                return team.__user__.id !== u.id;
              }) as user}
                <option value={user}>{user.name}</option>
              {/each}
            </select>
            <button on:click={() => addUserToTeam(team)}>Add User</button>
          </form>
        {/if}

        <!-- Members -->
        <h3 style="margin-top:20px;">MEMBERS</h3>
        <div class="primary">
          <p>
            Number of Members: {team.__members__.filter((m) => {
              return m.status === "accepted";
            }).length + 1}
          </p>
          <p>1. {team.__user__.name} <span class="you">Admin</span></p>
          {#each team.__members__.reverse() as member, sn}
            {#if member.status == "accepted"}
              <p class="item">
                {sn + 2}. {member.__user__.name}
                {#if user.id == member.__user__.id}
                  <span class="you">You</span>
                {/if}
              </p>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style scoped>
  .profile {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .first {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    margin-top: 10%;
  }

  .image {
    display: flex;
    flex-direction: row;
    justify-content: baseline;
    align-items: baseline;
  }

  .img-primary {
    background: rgb(29, 29, 29);
    padding: 30px;
    border-radius: 50%;
  }

  .img-secondary {
    position: absolute;
  }

  .img-secondary img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #fff;
    margin-top: 1.5rem;
    font-size: 1.5rem;
  }

  .error {
    color: red;
  }

  .bio {
    padding: 10px;
    text-align: center;
  }

  .addUser-form {
    width: 350px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .addUser-form select {
    width: 220px;
    padding: 5px;
  }

  .addUser-form button {
    width: 100px;
  }

  .you {
    background-color: #acabab;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    color: #111;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    cursor: pointer;
  }

  .item {
    color: #ff8c00;
  }

  .second {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    margin-top: 20px;
  }

  .primary-container {
    width: 350px;
    margin-top: 1rem;
  }

  .primary {
    background-color: #222222;
    padding: 1rem;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 1rem;
    color: #e4e4e4;
  }

  .primary > p {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  @keyframes animated-gradient {
    25% {
      background-position: left bottom;
    }
    50% {
      background-position: right bottom;
    }
    75% {
      background-position: right top;
    }
    100% {
      background-position: left top;
    }
  }
</style>
