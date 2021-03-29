<script lang="ts">
  import { onMount } from "svelte";
  import type { Team, User } from "../types";

  import { createEventDispatcher } from "svelte";
  import TeamPeek from "./sub/TeamPeek.svelte";
  const dispatch = createEventDispatcher();

  let accessToken = "";
  let searchItem = "";
  let loading = true;
  let teams: Array<Team> = [];
  let filteredTeams: Array<Team> = [];
  let singleTeam: Team = <Team>{};
  let user: User;
  let message = "Hi there";

  /* -------------------------------- Get Teams ------------------------------- */
  async function getTeams() {
    const response = await fetch(`${apiBaseURL}/teams`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json();
    teams = payload.teams;
    filteredTeams = payload.teams;
    loading = false;
  }

  /* -------------------------------- Get User ------------------------------- */
  async function getUser() {
    const response = await fetch(`${apiBaseURL}/user-light`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json();
    user = payload.user;
    loading = false;
  }

  /* ------------------------- Filter Based on Search ------------------------- */
  async function filterTeams() {
    filteredTeams = teams.filter((t) => {
      return t.name.match(searchItem);
    });
  }

  /* --------------------------- Set the Team for Sneak Peek -------------------------- */
  function setSingleTeam(team: Team) {
    singleTeam = team;
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        /* --------------------- Accept Token and Call all Users -------------------- */
        case "token":
          singleTeam = <Team>{};
          accessToken = message.value;
          getUser();
          getTeams();
          break;
      }
    });

    /* ----------------------------- Call for Token ----------------------------- */
    tsvscode.postMessage({
      type: "get-token",
      value: undefined,
    });
  });

  /* ---------------------- Format Date to Readable form ---------------------- */
  function renderDate(val: string | number | Date): string {
    const date = new Date(val);
    return date.toDateString();
  }

  function Message() {
    var theDiv = document.getElementById("comtainer");
    var content = document.createTextNode(message);
    theDiv?.appendChild(content);
  }
</script>

<div id="page-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        {#if loading}
          <!-- Fetching Teams -->
          <div class="no-team-found">
            <h3>Fetching Teams...</h3>
          </div>
        {:else}
          <!-- Search Team -->
          <form class="search">
            <input
              type="search"
              placeholder="Search For a Team"
              bind:value={searchItem}
              on:keyup={() => {
                filterTeams();
              }}
            />
          </form>
          <!-- Teams Completely Fetched -->
          {#if filteredTeams.length > 0}
            <!-- There are Teams -->
            <div class="teams-row">
              <!-- Display Teams -->
              {#each filteredTeams as team}
                <div
                  class="team-box"
                  on:click={() => {
                    setSingleTeam(team);
                  }}
                >
                  <div class="team-each">
                    <h2 class="img">{team.name.slice(0, 2)}</h2>
                  </div>
                  <div class="team-head">
                    <p class="name">Team: {team.name}</p>
                    <p class="name">Owner: {team.__user__.name}</p>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- No Team Found -->
            <div class="no-team-found">
              <h3>Oops 😔 ! Sorry no team found...</h3>
            </div>
          {/if}
        {/if}
      </div>
      <div class="col-sm-4 sticky">
        {#if Object.keys(singleTeam).length > 1}
          <!-- Show Single Team Sneak Peek -->
          <TeamPeek team={singleTeam} {accessToken} {user} />
        {:else}
          <!-- No Single Team -->
          <div class="no-team-found sticky">
            <h3>Any Selected Team will preview here..</h3>

            <div id="comtainer" class="contain" />

            <input type="text" bind:value={message} name="message" />
            <button on:click={() => Message()}>SUBMIT</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style scoped>
  .sticky {
    position: sticky;
  }

  #page-wrapper {
    position: relative;
  }

  .container {
    width: 100%;
    margin: 0 auto;
  }

  .row:after,
  .row:before {
    display: table;
    clear: both;
  }

  .col-sm-6 {
    float: left;
    border-right: 1px solid rgb(77, 77, 77);
  }

  .col-sm-4 {
    float: left;
  }

  @media (min-width: 840px) {
    .col-sm-6 {
      width: 40%;
    }
    .col-sm-4 {
      width: 60%;
    }
  }

  @media (max-width: 840px) {
    .col-sm-6 {
      width: 100%;
    }

    .col-sm-4 {
      width: 100%;
      display: none;
    }
  }

  .teams-row {
    display: flex;
    margin-top: 1rem;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .team-box {
    margin-top: 1.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    height: 120px;
    width: 300px;
    cursor: pointer;
    transition: 0.5s all;
    background: rgb(36, 36, 36);
    border-left: 2px solid #fff;
  }

  .team-head {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 3%;
    cursor: pointer;
    height: 80%;
  }

  .team-box:hover {
    transform: scale(1.05);
  }

  .team-each .img {
    background: rgb(24, 24, 24);
    padding: 30px;
    border-radius: 50%;
  }

  .name {
    color: #fff;
  }

  .search {
    margin-top: 2rem;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  input[type="search"] {
    padding: 1rem;
    width: 90%;
  }

  .no-team-found {
    display: flex;
    flex-direction: column;
    height: 400px;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
