<script lang="ts">
  import { onMount } from "svelte";
  import type { Team, User } from "../types";

  import { createEventDispatcher } from "svelte";
  import TeamPeek from "./sub/TeamPeek.svelte";
  import LoadingData from "./shared/LoadingData.svelte";
  import NoDataFound from "./shared/NoDataFound.svelte";
  const dispatch = createEventDispatcher();

  let accessToken = "";
  let searchItem = "";
  let loading = true;
  let teams: Array<Team> = [];
  let filteredTeams: Array<Team> = [];
  let singleTeam: Team = <Team>{};
  let showSingleTeam: boolean = false;
  let user: User;

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
    showSingleTeam = true;
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
</script>

<div id="page-wrapper">
  <div class="container">
    <!-- Search Team -->
    <div class="search">
      <form class="form">
        <input
          type="search"
          placeholder="Search For a Team"
          bind:value={searchItem}
          on:keyup={() => {
            filterTeams();
          }}
        />
      </form>
      <div class="layout">
        <i class="fa fa-th" />
        <i class="fa fa-list" />
      </div>
    </div>

    <!-- Info -->
    <div class="info">
      <i class="fa fa-info" />
      <span> To view more info, You can click on a Team to Expand. </span>
    </div>

    {#if loading}
      <!-- Fetching Teams -->
      <div class="center">
        <LoadingData message="Please wait while we fetch Teams..." />
      </div>
    {:else}
      <!-- Teams Completely Fetched -->
      {#if filteredTeams.length > 0}
        <!-- There are Teams -->
        <div class="teams-container">
          <div class="teams-row">
            <!-- Display Teams -->
            {#each filteredTeams as team}
              <div
                class="team-box"
                on:click={() => {
                  setSingleTeam(team);
                }}
              >
                <div class="team-image">
                  <div class="initials-container">
                    <span class="initials">{team.name.slice(0, 2)}</span>
                  </div>
                  <div class="icon-container">
                    <i class="fa fa-user-friends icon" />
                  </div>
                </div>

                <div class="team-header">
                  <h3>{team.name}</h3>
                  <p>{team.description.slice(0, 75)}</p>
                </div>

                <div class="team-box-first-row">
                  <div class="team-projects">
                    <i class="fa fa-project-diagram" />
                    {team.__projects__.length}
                  </div>

                  <div class="team-codes">
                    <i class="fa fa-code" />
                    {team.__projects__.length}
                  </div>

                  <div class="team-date">
                    <i class="fa fa-calendar" />
                    {renderDate(team.created_at)}
                  </div>
                </div>

                <hr />

                <div class="team-box-second-row">
                  <div class="team-users-each-owner">
                    <img src={team.__user__.image} alt="IMG" />
                  </div>
                  {#each team.__members__.filter((m) => {
                    return m.status === "accepted";
                  }) as member, id}
                    {#if id <= 3}
                      <div class="team-users-each">
                        <img src={member.__user__.image} alt="IMG" />
                      </div>
                    {/if}

                    {#if id == 4}
                      <div class="team-users-each-plus">
                        <span>
                          + {team.__members__.filter((m) => {
                            return m.status === "accepted";
                          }).length - 4}
                        </span>
                      </div>
                    {/if}
                  {:else}
                    <p>No Team Member.</p>
                  {/each}
                </div>
                <div class="name-container">
                  <p class="name">
                    Creator: {team.__user__.name}
                    {#if team.__user__.verified}
                      <!-- Verified Icon -->
                      <svg
                        width="17px"
                        height="17px"
                        viewBox="0 0 17 17"
                        class="VerifiedIcon"
                        ><g
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                          ><g transform="translate(-767.000000, -573.000000)"
                            ><g transform="translate(-80.000000, -57.000000)"
                              ><g transform="translate(100.000000, 77.000000)"
                                ><g
                                  transform="translate(400.000000, 401.000000)"
                                  ><g
                                    transform="translate(347.000000, 152.000000)"
                                    ><path
                                      d="M1.74035847,11.2810213 C1.61434984,11.617947 1.54545455,11.982746 1.54545455, 12.3636364 C1.54545455,14.0706983 2.92930168,15.4545455 4.63636364,15.4545455 C5.01725401,15.4545455 5.38205302,15.3856502 5.71897873,15.2596415 C6.22025271,16.2899361 7.2772042,17 8.5,17 C9.7227958,17 10.7797473,16.2899361 11.2810213,15.2596415 L11.2810213,15.2596415 C11.617947,15.3856502 11.982746,15.4545455 12.3636364,15.4545455 C14.0706983,15.4545455 15.4545455,14.0706983 15.4545455,12.3636364 C15.4545455,11.982746 15.3856502,11.617947 15.2596415,11.2810213 C16.2899361,10.7797473 17,9.7227958 17,8.5 C17,7.2772042 16.2899361,6.22025271 15.2596415,5.71897873 C15.3856502,5.38205302 15.4545455,5.01725401 15.4545455,4.63636364 C15.4545455,2.92930168 14.0706983,1.54545455 12.3636364,1.54545455 C11.982746,1.54545455 11.617947,1.61434984 11.2810213,1.74035847 C10.7797473,0.71006389 9.7227958,0 8.5,0 C7.2772042,0 6.22025272,0.71006389 5.71897873,1.74035847 C5.38205302,1.61434984 5.01725401,1.54545455 4.63636364,1.54545455 C2.92930168,1.54545455 1.54545455,2.92930168 1.54545455,4.63636364 C1.54545455,5.01725401 1.61434984,5.38205302 1.74035847,5.71897873 C0.71006389,6.22025272 0,7.2772042 0,8.5 C0,9.7227958 0.71006389,10.7797473 1.74035847,11.2810213 L1.74035847,11.2810213 Z"
                                      class="verified-bg"
                                      opacity="1"
                                      fill="#88C9F9"
                                    /><path
                                      d="M11.2963464,5.28945679 L6.24739023,10.2894568 L7.63289664,10.2685106 L5.68185283,8.44985845 C5.27786241,8.07328153 4.64508754,8.09550457 4.26851062,8.499495 C3.8919337,8.90348543 3.91415674,9.53626029 4.31814717,9.91283721 L6.26919097,11.7314894 C6.66180802,12.0974647 7.27332289,12.0882198 7.65469737,11.7105432 L12.7036536,6.71054321 C13.0960757,6.32192607 13.0991603,5.68876861 12.7105432,5.29634643 C12.3219261,4.90392425 11.6887686,4.90083965 11.2963464,5.28945679 L11.2963464,5.28945679 Z"
                                      class="verified-check"
                                      fill="#FFFFFF"
                                    /></g
                                  ></g
                                ></g
                              ></g
                            ></g
                          ></g
                        ></svg
                      >
                    {/if}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <!-- No Team Found -->
        <div class="center">
          <NoDataFound
            message="Oops 😔 ! There are no teams at the moment. Kindly check back..."
          />
        </div>
      {/if}
    {/if}
  </div>

  {#if showSingleTeam}
    <div class="singleTeam-container">
      <i
        class="fa fa-window-close close"
        on:click={() => {
          showSingleTeam = false;
        }}
      />
      <div class="single-team">
        {#if Object.keys(singleTeam).length > 1}
          <TeamPeek
            team={singleTeam}
            {accessToken}
            {user}
            on:addUserToTeam={() => {
              showSingleTeam = false;
            }}
          />
        {:else}
          <div class="single-team-loading">
            <div>
              <i class="fa fa-spinner fa-spin" />
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style scoped>
  #page-wrapper {
    position: relative;
    overflow-x: hidden;
  }

  .container {
    width: 100%;
    margin: 0 auto;
  }

  .info {
    text-align: center;
    padding-bottom: 20px;
  }

  .info i {
    margin-right: 5px;
    background-color: #0e639c;
    color: #fff;
    padding: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  /* Team List Section */

  .teams-container {
    overflow-y: scroll;
    height: 100vh;
    padding-top: 30px;
    padding-bottom: 30%;
    padding-left: 2px;
    padding-right: 2px;
  }

  .teams-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: flex-start;
  }

  .team-box {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    width: 20rem;
    background-color: #1a1919;
    border: 1px solid #252525;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 15px;
    cursor: pointer;
    transition: 0.5s all;
    transition-timing-function: ease-in-out;
    transition-property: "transform";
  }

  .team-box:hover {
    transform: scale(1.05);
  }

  .team-image {
    display: flex;
    flex-direction: column;
    background-color: #151616;
    width: 100%;
    height: 120px;
    border-radius: 10px;
  }

  .initials-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .initials {
    font-weight: bold;
    text-align: end;
    background-color: #e4e2e2;
    color: #000;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-top-right-radius: 0px;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 10px;
  }

  .icon-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
  }

  .icon {
    color: #ff8c00;
    font-size: 2rem;
  }

  .team-header {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .team-header h3 {
    color: #d4d4d4;
    font-size: 1.3rem;
  }

  .team-header p {
    color: #7e7e7e;
    font-size: 1rem;
    text-align: justify;
    margin-top: 10px;
  }

  .team-box-first-row {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    width: inherit;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .team-projects {
    background-color: #7e7e7e;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 20px;
  }

  .team-codes {
    background-color: #7e7e7e;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 20px;
    margin-left: 8px;
  }

  .team-date {
    color: #7e7e7e;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-left: 8px;
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

  hr {
    width: 90%;
    border: 1px solid #252525;
  }

  .team-box-second-row {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    width: inherit;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
  }

  .team-users-each-owner img {
    width: 35px;
    display: block;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .team-users-each img {
    width: 25px;
    display: block;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .team-users-each-plus {
    width: 25px;
    display: block;
    height: 25px;
  }

  .team-users-each-plus span {
    display: block;
    border-radius: 50%;
    margin-right: 10px;
    border: 1px solid #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .name-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
    width: 100%;
    padding-left: 10px;
    margin-top: 10px;
  }

  .name {
    color: #bebebe;
  }

  .name svg {
    margin-left: 1px;
    width: 12px;
    height: 12px;
  }

  /* Team List Section Ends  */

  /* Search Section  */

  .search {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    position: sticky;
    padding-top: 50px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    width: 90%;
    margin: auto;
  }

  .form {
    width: 80%;
    height: 50px;
  }

  input[type="search"] {
    padding-top: 1rem;
    padding-left: 2rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    height: 100%;
    width: 100%;
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    border-bottom-right-radius: 25px;
    border-bottom-left-radius: 25px;
    background-color: #151616;
    color: #fff;
  }

  input[type="search"]:focus,
  input[type="search"]:active {
    outline: none !important;
    border: none !important;
  }

  .layout {
    margin-top: 10px;
    height: 50px;
    width: 10%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }

  .layout i {
    font-size: 20px;
    cursor: pointer;
  }

  /* Search Section Ends  */

  /* Single Team */

  .singleTeam-container {
    position: absolute;
    width: 100%;
    top: 7%;
    z-index: 10;
    background-color: transparent;
    display: flex;
    justify-content: center;
  }

  .single-team {
    background-color: #151616;
    overflow-y: scroll;
    height: 80vh;
    width: 400px;
    padding-bottom: 50px;
  }

  .close {
    font-size: 1.3rem;
    color: #fff;
    cursor: pointer;
  }
  /* Single Team Ends */

  /* Others */
  .single-team-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .single-team-loading i {
    font-size: 3rem;
  }

  .center {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
