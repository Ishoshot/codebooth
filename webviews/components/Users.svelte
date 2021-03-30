<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import LoadingData from "./shared/LoadingData.svelte";
  import NoDataFound from "./shared/NoDataFound.svelte";
  import UserPeek from "./sub/UserPeek.svelte";

  let accessToken = "";
  let loading = true;
  let searchItem = "";
  let users: Array<User> = [];
  let filteredUsers: Array<User> = [];
  let singleUser: User;
  let showSingleUser: boolean = false;
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
    showSingleUser = true;
    const response = await fetch(`${apiBaseURL}/user/details`, {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const payload = await response.json();
    singleUser = payload.user;
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
        /* --------------------- Accept Token and Call all Users -------------------- */
        case "token":
          accessToken = message.value;
          getUsers();
          break;
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
          placeholder="Search For User"
          bind:value={searchItem}
          on:keyup={() => {
            filterUsers();
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
      <span>
        You can click on the Caret on the User to Expand (mini), or/and
        Double-Click on a user to Expand (maxi).
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
              <div
                class="user-box"
                on:dblclick={() => {
                  setSingleUser(user);
                }}
              >
                <div class="user-box-first-row">
                  <div class="col">
                    <div class="user-each">
                      <img src={user.image} alt="avatar" />
                    </div>
                    <span class="fa fa-star">
                      {user.__stars__.length}
                    </span>
                  </div>

                  <p class="name">
                    {user.name.slice(0, 24)}
                    {#if user.verified}
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
                    <span class="githubId">{user.githubId} </span>
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
                      <p><i class="fa fa-address-card" /> {user.bio}</p>
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
            message="Oops 😔 ! There are no users at the moment. Kindly check back..."
          />
        </div>
      {/if}
    {/if}
    <!--  -->
    <!-- Show Single User Sneak Peek -->
    {#if showSingleUser}
      <div class="singleUser-container">
        <i
          class="fa fa-window-close close"
          on:click={() => {
            showSingleUser = false;
          }}
        />
        <div class="single-user">
          {#if singleUser}
            <UserPeek user={singleUser} {accessToken} />
          {:else}
            <div class="single-user-loading">
              <div>
                <i class="fa fa-spinner fa-spin" />
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
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

  /* User List Section */

  .users-container {
    overflow-y: scroll;
    height: 100vh;
    padding-top: 30px;
    padding-bottom: 30%;
    padding-left: 0px;
    padding-right: 0px;
  }

  .users-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: flex-start;
  }

  .user-box {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    width: 20rem;
    background-color: #1a1919;
    border: 1px solid #252525;
    border-top-right-radius: 10px;
    border-top-left-radius: 40px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 15px;
    cursor: pointer;
    transition: 0.5s all;
    transition-timing-function: ease-in-out;
    transition-property: "transform";
  }

  .user-box:hover {
    transform: scale(1.05);
  }

  .user-box-first-row {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 7px;
    padding-bottom: 7px;
    display: flex;
    width: inherit;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .user-each {
    display: inline-block;
    padding: 2px;
    background: linear-gradient(150deg, #0e639c, #ff8c00);
    border-radius: 50%;
    background-size: 60% 60%;
    animation: animated-gradient 2.5s linear infinite;
  }

  .user-each img {
    width: 30px;
    display: block;
    height: 30px;
    border-radius: 50%;
  }

  .name {
    color: #fff;
  }

  .name svg {
    margin-left: 1px;
    width: 12px;
    height: 12px;
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

  .hr {
    width: 100%;
    border: 1px solid #252525;
  }

  .user-box-second-row {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    width: inherit;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
  }

  .user-box-second-row .col {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-around;
  }

  .user-box-second-row .col .email {
    font-size: 0.8rem;
    color: #fff;
  }

  .user-box-second-row .col .githubId {
    font-size: 0.8rem;
    margin-top: 6px;
    background-color: #ff8c00f5;
    padding-left: 7px;
    padding-right: 7px;
    padding-top: 3px;
    padding-bottom: 3px;
    color: #ffffff;
    border-radius: 15px;
  }

  .user-box-second-row .see i {
    font-size: 1.5rem;
  }
  /* User List Section Ends  */

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

  /* Extra Details Section */
  .extra-details {
    margin-top: 15px;
    width: 100%;
    background-color: #cccccc;
    border-radius: 10px;
    padding-left: 7px;
    padding-right: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    color: #151616;
  }

  .extra-details p {
    font-size: 0.8rem;
    margin-top: 3px;
    margin-bottom: 3px;
  }
  /* Extra Details Section Ends*/

  /* Single User */

  .singleUser-container {
    position: absolute;
    width: 100%;
    top: 7%;
    z-index: 10;
    background-color: transparent;
    display: flex;
    justify-content: center;
  }

  .single-user {
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
  /* Single User Ends */

  /* Others */
  .single-user-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .single-user-loading i {
    font-size: 3rem;
  }

  .fa-star {
    margin-top: 6px;
  }

  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
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
