<script lang="ts">
  import { onMount } from "svelte";
  import type { Activity, Team, TeamMember, User } from "../types";
  import Flair from "./local/Flair.svelte";
  import Radar from "svelte-chartjs/src/Radar.svelte";
  import HomeActions from "./HomeActions.svelte";
  import Login from "./Login.svelte";

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
  let activities: Activity[] = tsvscode.getState()?.activities || [];

  let showFlairsModule: boolean = false;
  let showTeamsModule: boolean = false;
  let showProjectsModule: boolean = false;

  // Persists the Value to state
  $: {
    tsvscode.setState({ page, activities });
  }

  // Chart
  let dataRadar = {
    labels: ["Flairs", "Teams", "Projects", "Codes", "Stars"],
    datasets: [
      {
        label: "My Data Overview",
        backgroundColor: "rgb(14, 99, 156, 0.5)",
        borderColor: "rgb(14, 99, 156)",
        data: [10, 6, 8, 26, 12],
      },
    ],
  };

  let options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Function to SetPage
  async function setPage(newPage: string | undefined) {
    if (newPage == undefined) {
      page = newPage;
    } else {
      page = newPage;
    }
  }

  // Toggle Flair Module Visibility
  function showFlairs() {
    showFlairsModule = !showFlairsModule;
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data sent from the extension
      switch (message.type) {
        case "token":
          {
            accessToken = message.value;
            if (accessToken) {
              const response = await fetch(`${apiBaseURL}/profile`, {
                headers: {
                  "content-type": "application/json",
                  accept: "application/json",
                  authorization: `Bearer ${accessToken}`,
                },
              });
              const data = await response.json();
              console.log(data);
              if (!data) {
                user = null;
                loading = false;
                return;
              }
              user = data.user;
              loading = false;
            } else {
              loading = false;
            }
          }
          break;

        case "logged-out":
          {
            accessToken = "";
            user = null;
          }
          break;
      }

      // activities = [];
    });

    // Send Message to SideBarProvider to Load Welcome for UnAuth User
    setTimeout(() => {
      if (accessToken === "" || accessToken == undefined) {
        tsvscode.postMessage({
          type: "show-welcome",
          value: undefined,
        });
      }
    }, 1000);

    // Call for Token
    tsvscode.postMessage({
      type: "get-token",
      value: undefined,
    });
  });
</script>

<!-- MOCK UP -->

<!-- svelte-ignore missing-declaration -->
<div class="side-wrapper">
  <div class="main">
    {#if loading}
      <!-- Authenticated, But no User Data -->
      <div>Loading ...</div>
    {:else if user !== null}
      <!-- Authenticated, User Data -->
      {#if page === "home"}
        <div class="chart">
          <Radar data={dataRadar} {options} />
        </div>

        <HomeActions on:showFlairs={() => showFlairs()} />

        {#if showFlairsModule}
          <Flair {user} {creatingFlair} />
        {/if}
      {:else if page === "profile"}
        <!--  -->
      {:else if page === "notifications"}
        <!--  -->
      {:else}
        <h1>Settings</h1>
      {/if}
    {:else}
      <!-- UnAuthenticated Users - Login Screen -->
      <Login
        on:githubauth={() => {
          tsvscode.postMessage({ type: "authenticate", value: undefined });
        }}
      />
    {/if}

    <div class="space" />
  </div>

  <!-- Footer -->
  <div class="sticky-foot nav">
    <span
      class={page == "home" ? "active" : ""}
      on:click={() => setPage("home")}
    >
      <i class="fa fa-home" />
    </span>
    <span
      class={page == "profile" ? "active" : ""}
      on:click={() => setPage("profile")}
    >
      <i class="fa fa-user-circle" />
    </span>

    {#if user}
      <span
        class={page == "notifications" ? "active" : ""}
        on:click={() => setPage("notifications")}
      >
        <i class="fa fa-bell" />
      </span>
    {:else}
      <span
        class={page == "notifications" ? "active" : ""}
        on:click={() => setPage("notifications")}
      >
        <i class="fa fa-bell" />
      </span>
    {/if}

    <span
      class={page == "settings" ? "active" : ""}
      on:click={() => setPage("settings")}
    >
      <i class="fa fa-cog" />
    </span>
  </div>
</div>

<!-- STYLE -->
<style scoped>
</style>
