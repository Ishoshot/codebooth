<script lang="ts">
  import { onMount } from "svelte";
  import type { Activity, User } from "../types";
  import Flair from "./local/Flair.svelte";
  import Radar from "svelte-chartjs/src/Radar.svelte";
  import HomeActions from "./HomeActions.svelte";
  import MyProjects from "./local/myProjects.svelte";
  import MyTeams from "./local/myTeams.svelte";
  import Profile from "./Profile.svelte";
  import Settings from "./Settings.svelte";

  // import Todos from "./Todos.svelte";

  let flair: "";
  let creatingFlair = false;

  let team: { teamName: string; teamDesc: string };
  let creatingTeam = false;

  let project: any;
  let creatingProject = false;

  let loading = true;
  let accessToken: "";
  let user: User | null = null;

  let page: string | undefined = tsvscode.getState()?.page || "home";
  let activities: Activity[] = tsvscode.getState().activities || [];

  let showFlairsModule: boolean = false;
  let showTeamsModule: boolean = false;
  let showProjectsModule: boolean = false;

  // Chart
  let dataRadar = {
    labels: ["Flairs", "Teams", "Projects", "Codes", "Stars"],
    datasets: [
      {
        label: "My Data Overview",
        backgroundColor: "rgb(14, 99, 156, 0.5)",
        borderColor: "rgb(14, 99, 156)",
        data: [0, 0, 0, 0, 0],
      },
    ],
  };

  let options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Persists the Value to state
  $: {
    tsvscode.setState({ page, activities });
  }

  /* --------------------------- populate Activities -------------------------- */
  function logActivity(message: string) {
    // Populate Activity
    const activity: Activity = {
      message,
      read: false,
      date: new Date(),
    };
    activities = [activity, ...activities];
  }

  /* ---------------------- Populate Chart with User Data --------------------- */
  function feedChart(user: User) {
    dataRadar.datasets[0].data[0] = user.__flairs__.length;
    dataRadar.datasets[0].data[1] = user.__teams__.length;
    dataRadar.datasets[0].data[2] = user.__projects__.length;
    dataRadar.datasets[0].data[3] = 10;
    dataRadar.datasets[0].data[4] = user.__stars__.length;
  }

  /* --------------------------------- SetPage -------------------------------- */
  async function setPage(newpPage: string | undefined) {
    if (newpPage == undefined) {
      page = newpPage;
    } else {
      page = newpPage;
    }
  }

  /* --------------------------------- LogOut --------------------------------- */
  function logOut() {
    tsvscode.postMessage({ type: "logout", value: undefined });
  }

  /* --------------------- Toggle Flair Module Visibility --------------------- */
  function showFlairs() {
    showFlairsModule = !showFlairsModule;
  }

  /* --------------------- Toggle Teams Module Visibility --------------------- */
  function showTeams() {
    showTeamsModule = !showTeamsModule;
  }

  /* --------------------- Toggle Projects Module Visibility --------------------- */
  function showProjects() {
    showProjectsModule = !showProjectsModule;
  }

  /*--------------------- Create Flair --------------------- */
  async function createFlair() {
    creatingFlair = true;
    const response = await fetch(`${apiBaseURL}/flair/create`, {
      method: "POST",
      body: JSON.stringify({
        name: flair,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (data.flair === null) {
      tsvscode.postMessage({
        type: "onError",
        value:
          "Error Encountered while creating Flair. Possible Reason: Limit [5 flairs] reached OR Flair alraedy exists for you",
      });
      creatingFlair = false;
    } else {
      const message = `You Created a Flair - ${flair}`;
      logActivity(message);
      creatingFlair = false;
    }
  }

  /*--------------------- Create Team --------------------- */
  async function createTeam() {
    creatingTeam = true;
    const response = await fetch(`${apiBaseURL}/team/create`, {
      method: "POST",
      body: JSON.stringify({
        name: team.teamName,
        desc: team.teamDesc,
        visibility: true,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (data.team === null) {
      tsvscode.postMessage({
        type: "onError",
        value:
          "Error Encountered while creating Team. Possible Reason: Team Name already exists",
      });
    }
    creatingTeam = false;
  }

  /*--------------------- Create Project --------------------- */
  async function createProject() {
    creatingProject = true;
    const response = await fetch(`${apiBaseURL}/project/create`, {
      method: "POST",
      body: JSON.stringify({
        name: project.name,
        desc: project.desc,
        team_id: project.team == null || undefined ? null : project.team,
        visibility: true,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (data.project === null) {
      tsvscode.postMessage({
        type: "onError",
        value:
          "Error Encountered while creating Project. Possible Reason: Project Name already exists",
      });
    }
    creatingProject = false;
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case "token":
          accessToken = message.value;
          if (accessToken) {
            const response = await fetch(`${apiBaseURL}/profile`, {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });

            const data = await response.json();
            if (!data) {
              user = null;
              loading = false;
              return;
            }
            user = data.user;
            feedChart(data.user);
            loading = false;
          } else {
            loading = false;
          }
          break;

        case "logged-out":
          accessToken = "";
          user = null;
          break;

        case "new-flair":
          flair = message.value;
          await createFlair().then(() => {
            /* --------------- Call for Token to Refresh User Data ---------------- */
            tsvscode.postMessage({
              type: "get-token",
              value: undefined,
            });
          });
          break;

        case "new-team":
          team = message.value;
          await createTeam().then(() => {
            /* --------------- Call for Token to Refresh User Data ---------------- */
            tsvscode.postMessage({
              type: "get-token",
              value: undefined,
            });
          });
          break;

        case "new-project":
          project = message.value;
          await createProject().then(() => {
            /* --------------- Call for Token to Refresh User Data ---------------- */
            tsvscode.postMessage({
              type: "get-token",
              value: undefined,
            });
          });
          break;
      }

      // activities = [];
    });

    /* ------ Send Message to SideBarProvider to Load Welcome for UnAuth User ------ */
    if (accessToken === "" || accessToken == undefined) {
      tsvscode.postMessage({
        type: "show-welcome",
        value: undefined,
      });
    }

    /* ----------------------------- Call for Token ----------------------------- */
    tsvscode.postMessage({
      type: "get-token",
      value: undefined,
    });
  });
</script>

<!-- svelte-ignore missing-declaration -->
<div class="side-wrapper">
  <div class="main">
    {#if loading}
      <!-- Authenticated, But no User Data -->
      <div>Loading ...</div>
    {:else if user !== null}
      <!-- User Data Is Available -->
      {#if page === "home"}
        <!-- PAGE == HOME -->

        <div class="chart">
          <Radar data={dataRadar} {options} />
        </div>

        <HomeActions
          on:showFlairs={() => showFlairs()}
          on:showTeams={() => showTeams()}
          on:showProjects={() => showProjects()}
        />
        {#if showFlairsModule}
          <Flair {user} {creatingFlair} />
        {/if}
        {#if showTeamsModule}
          <MyTeams {user} {creatingTeam} />
        {/if}
        {#if showProjectsModule}
          <MyProjects {user} {creatingProject} />
        {/if}
        <!-- <Todos {user} {accessToken} /> -->
      {:else if page === "profile"}
        <!-- PAGE == PROFILE -->
        <Profile {user} on:logout={() => logOut()} />
      {:else}
        <!-- PAGE == SETTINGS -->
        <Settings {user} {activities} />
      {/if}
    {:else}
      <!-- UnAuthenticated Users -->

      <button
        on:click={() => {
          tsvscode.postMessage({ type: "authenticate", value: undefined });
        }}
      >
        Log in with Github
      </button>
    {/if}

    <div class="space" />
  </div>

  <!-- Footer -->
  <div class="sticky-foot nav">
    <span
      class={page == "home" ? "active" : ""}
      on:click={() => setPage("home")}><i class="fa fa-home" /></span
    >
    <span
      class={page == "profile" ? "active" : ""}
      on:click={() => setPage("profile")}><i class="fa fa-user-circle" /></span
    >
    <span
      class={page == "settings" ? "active" : ""}
      on:click={() => setPage("settings")}><i class="fa fa-cog" /></span
    >
  </div>
</div>

<style>
  .side-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: scroll;
    margin-top: 0%;
  }

  .chart {
    background-color: #ececec;
    padding-left: 10px;
    padding-right: 10px;
    height: 350px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .active {
    color: #0e639c;
  }

  .sticky-foot i {
    font-size: 2rem;
  }

  .space {
    height: 100px;
  }
</style>
