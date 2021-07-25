<script lang="ts">
  import { onMount } from "svelte";
  import type {
    Activity,
    Team,
    TeamMember,
    User,
    Flair as FlairData,
  } from "../types";
  import Flair from "./local/Flair.svelte";
  import Radar from "svelte-chartjs/src/Radar.svelte";
  import HomeActions from "./HomeActions.svelte";
  import Login from "./Login.svelte";
  import Profile from "./Profile.svelte";
  import Notifications from "./Notifications.svelte";

  // Flair
  let flair: "";
  let flairs: FlairData[];
  let creatingFlair = false;
  let showFlairsModule: boolean = false;

  //Activity
  let activities: Activity[];

  let team: { teamName: string; teamDesc: string };
  let creatingTeam = false;

  let project: any;
  let creatingProject = false;

  let loading = true;
  let accessToken: "";
  let user: User | null = null;

  let page: string | undefined = tsvscode.getState()?.page || "home";

  let showTeamsModule: boolean = false;
  let showProjectsModule: boolean = false;

  // Persists the Value to state
  $: {
    tsvscode.setState({ page });
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

  // Send Message to SideBarProvider to LogOut
  function logOut() {
    tsvscode.postMessage({ type: "logout", value: undefined });
  }

  // Clear Token on Server
  async function clearTokenOnServer() {
    const response = await fetch(`${apiBaseURL}/auth/logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data: any = await response.json();
    console.log(data);
    if (response.status == 200) {
      tsvscode.postMessage({
        type: "clearToken",
        value: undefined,
      });
      accessToken = "";
      user = null;
    }
  }

  // Get User's [Profile | Activities]
  async function getUserProfile() {
    const response = await fetch(`${apiBaseURL}/profile`, {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    // console.log(data);
    if (!data) {
      user = null;
      loading = false;
      return;
    }
    user = data.user;
    activities = data.user.activities;
    loading = false;
  }

  // Toggle Flair Module Visibility
  function showFlairs() {
    showFlairsModule = !showFlairsModule;
  }

  // Function to Get User's Flairs
  async function getFlairs() {
    const response = await fetch(`${apiBaseURL}/user/flairs`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    // console.log(data);
    if (!data) {
      flairs = [];
      return;
    }
    flairs = data.flairs;
  }

  // Function to Create Flair
  async function createFlair() {
    creatingFlair = true;
    const response = await fetch(`${apiBaseURL}/user/flair`, {
      method: "POST",
      body: JSON.stringify({
        name: flair,
      }),
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data: any = await response.json();
    // console.log(data);
    if (response.status == 400) {
      tsvscode.postMessage({
        type: "onError",
        value:
          "Error Encountered While Creating Flair. Possible Reason(s): Limit [5 flairs] reached.",
      });
      creatingFlair = false;
      return;
    }
    if (response.status == 422) {
      tsvscode.postMessage({
        type: "onError",
        value:
          "Error Encountered While Creating Flair. Possible Reason(s): Flair already exists for you OR Ensure you're providing a valid input.",
      });
      creatingFlair = false;
      return;
    }
    // Append to Existing flairs
    flairs = [...flairs, data.flair];
    // Log Activity
    activities = [data.activity, ...activities];
    // Show Message
    tsvscode.postMessage({
      type: "onInfo",
      value: `Your flair: ${data.flair.name} was created successfully`,
    });

    creatingFlair = false;
  }

  // Function to Delete Flair
  async function deleteFlair(event: CustomEvent<any>) {
    creatingFlair = true;
    let id = event.detail;
    const response = await fetch(`${apiBaseURL}/user/flair/${id}`, {
      method: "DELETE",
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
        value:
          "Error Encountered While Deleting Flair. Possible Solution(s): Try Again after a while OR Please create an Issue on GitHub",
      });
      creatingFlair = false;
      return;
    } else {
      // Remove from to Existing flairs
      flairs = flairs.filter((inFlair) => inFlair.id != data.flair.id);
      // Log Activity
      activities = [data.activity, ...activities];
      // Show Message
      tsvscode.postMessage({
        type: "onInfo",
        value: `Your flair: ${data.flair.name} was deleted successfully`,
      });
      creatingFlair = false;
    }
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data sent from the extension
      switch (message.type) {
        case "token":
          {
            accessToken = message.value;
            if (accessToken !== "") {
              await getUserProfile();
              await getFlairs();
            } else {
              loading = false;
            }
          }

          break;

        case "logged-out":
          {
            await clearTokenOnServer();
          }
          break;

        case "new-flair":
          {
            flair = message.value;
            await createFlair();
          }
          break;
      }
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

  import { Skeleton } from "svelte-loading-skeleton";
</script>

<!-- MOCK UP -->

<!-- svelte-ignore missing-declaration -->
<div class="side-wrapper">
  <div class="main">
    {#if loading}
      <!-- Authenticated, But no User Data -->
      <Skeleton
        width="100vw"
        height="600px"
        borderRadius="0px"
        baseColor="transparent"
        highlightColor="rgb(158,158,167,0.08)"
        animationLength="1.3s"
      />
    {:else if user !== null}
      <!-- Authenticated, User Data -->
      {#if page === "home"}
        <div class="chart">
          <Radar data={dataRadar} {options} />
        </div>

        <HomeActions on:showFlairs={() => showFlairs()} />

        {#if showFlairsModule}
          <Flair
            {flairs}
            {creatingFlair}
            on:deleteflair={(event) => deleteFlair(event)}
          />
        {/if}
      {:else if page === "profile"}
        <Profile {user} on:logout={() => logOut()} />
      {:else if page === "notifications"}
        <Notifications {activities} {accessToken} />
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

    {#if user !== null}
      <span
        style="position:relative;"
        class={page == "notifications" ? "active" : ""}
        on:click={() => setPage("notifications")}
      >
        <i class="fa fa-bell" />
        <!-- if you have any notifications from activities, display the count -->
        {#if activities.filter((a) => a.read_at == false).length > 0}
          <div class="count">
            {activities.filter((a) => a.read_at == false).length}
          </div>
        {/if}
      </span>
    {:else}
      <span
        style="position:relative;"
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
