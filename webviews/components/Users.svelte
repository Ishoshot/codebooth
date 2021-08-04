<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import LoadingData from "./shared/LoadingData.svelte";
  import NoDataFound from "./shared/NoDataFound.svelte";

  let accessToken = "";
  let loading = true;
  let searchItem = "";
  let users: Array<User> = [];
  let filteredUsers: Array<User> = [];
  let showDetails: boolean = false;
  let showDetailsUser: string;

  /* -------------------------------- Get Users ------------------------------- */
  async function getUsers() {
    const response = await fetch(`${apiBaseURL}/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const payload = await response.json();
    console.log(payload);
    users = payload.users;
    filteredUsers = payload.users;
    loading = false;
  }

  /* ------------------------- Filter Based on Search ------------------------- */
  async function filterUsers() {
    filteredUsers = users.filter((u) => {
      return u.name.match(searchItem);
    });
  }

  /* --------------------------- Set the User for Sneak Peek -------------------------- */
  async function setSingleUser(user: User) {
    tsvscode.postMessage({
      type: "show-singleUser",
      value: user.id + "/" + user.name,
    });
  }

  /* ---------------------- Show More Details for a User ---------------------- */
  function seeMore(user: User) {
    showDetails = !showDetails;
    showDetailsUser = user.id;
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        /* --------------------- Accept Token and getUsers() -------------------- */
        case "token": {
          accessToken = message.value;
          getUsers();
          break;
        }
      }
    });

    /* ----------------------------- Call for Token ----------------------------- */
    tsvscode.postMessage({
      type: "get-token",
      value: undefined,
    });
  });
</script>

<div id="page-wrapper">
  <div class="container">
    <!-- Search User -->
    <div class="search">
      <form class="form">
        <input
          type="search"
          placeholder="Search for User"
          bind:value={searchItem}
          on:keyup={() => {
            filterUsers();
          }}
        />
      </form>
      <div class="layout">
        <i class="fa fa-th active" />
        <i class="fa fa-list" />
      </div>
    </div>

    <!-- Info -->
    <div class="info">
      <i class="fa fa-info" />
      <span>
        You can click on the caret on each User to Expand (mini), or/and click
        on view profile to Expand (maxi).
      </span>
    </div>

    {#if loading}
      <!-- Fetching Users -->
      <div class="center">
        <LoadingData message="Please wait while we fetch Users...." />
      </div>
    {:else}
      <!-- Users Completely Fetched -->
      {#if filteredUsers.length > 0}
        <!-- There are Users -->
        <div class="users-container">
          <div class="users-row">
            <!-- Display Users -->
            {#each filteredUsers as user}
              <div class="user-box">
                <div class="user-box-first-row">
                  <div class="col">
                    <div class="user-each">
                      <img src={user.image} alt="avatar" />
                    </div>
                  </div>

                  <p class="name">
                    {user.name.slice(0, 24)}
                    {#if user.is_verified}
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

                <hr class="hr" />

                <div class="user-box-second-row">
                  <div class="col">
                    <span class="email">{user.email}</span>
                    <div style="display:flex;">
                      <span class="githubId">{user.github_id} </span>
                      <span
                        class="view-profile"
                        style="margin-left:10px"
                        on:click={() => {
                          setSingleUser(user);
                        }}
                        >view profile
                      </span>
                    </div>
                  </div>

                  <div class="see">
                    <i
                      class={showDetailsUser && showDetailsUser == user.id
                        ? "fa fa-caret-up"
                        : "fa fa-caret-down"}
                      on:click={() => {
                        seeMore(user);
                      }}
                    />
                  </div>

                  {#if showDetails && showDetailsUser == user.id}
                    <div class="extra-details">
                      <p><i class="fa fa-address-card" /> {user.description}</p>
                      <p>
                        <i class="fa fa-building" />
                        {user.company ? user.company : ""}
                      </p>
                      <p><i class="fa fa-map-marker-alt" /> {user.location}</p>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <!-- No User Found -->
        <div class="center">
          <NoDataFound
            message="Oops!😔 There are no users at the moment. Kindly check back..."
          />
        </div>
      {/if}
    {/if}
    <!--  -->
  </div>
</div>

<style scoped>
</style>
