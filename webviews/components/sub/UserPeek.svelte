<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../../types";
  import { createEventDispatcher } from "svelte";
  import Star from "../util/Star.svelte";

  export let user: User;
  export let accessToken: string;

  const dispatch = createEventDispatcher();

  /* ---------------------- Format Date to Readable form ---------------------- */
  function renderDate(val: string | number | Date): string {
    const date = new Date(val);
    return date.toDateString() + " @ " + date.toLocaleTimeString();
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<div class="profile">
  <!-- First Widget -->
  <div class="first">
    <div class="image">
      <img src={user.image} alt="avatar" />
    </div>
    <p class="name">
      {user.name}
      {#if user.verified}
        <!-- Verified Icon -->
        <svg width="17px" height="17px" viewBox="0 0 17 17" class="VerifiedIcon"
          ><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
            ><g transform="translate(-767.000000, -573.000000)"
              ><g transform="translate(-80.000000, -57.000000)"
                ><g transform="translate(100.000000, 77.000000)"
                  ><g transform="translate(400.000000, 401.000000)"
                    ><g transform="translate(347.000000, 152.000000)"
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

    <span class="fa fa-star" style="margin-top:10px;">
      {user.__stars__.length}
    </span>

    <p class="bio">{user.bio}</p>

    <div class="flairs-row">
      {#each user.__flairs__.reverse() as flair}
        <!-- Display Flairs -->
        <span class="flairItem">{flair.name}</span>
      {:else}
        <!-- Flair's Empty -->
        <h4>
          this.user.flairs.isEmpty(); <span style="color:#ff8c00">//true</span> 🤪
        </h4>
      {/each}
    </div>

    <div class="first-row">
      <p class="uniqueId">#{user.githubId}</p>
      <Star {user} {accessToken} />
    </div>
  </div>

  <div class="second">
    <div class="primary-container">
      <div class="primary">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Company: {user.company ? user.company : ""}</p>
        <p>Location: {user.location}</p>
        <p>Joined: {renderDate(user.created_at)}</p>
        <p>
          GITHUB: <a href={user.github_url}>
            <i class="fab fa-github fa-2x" />
          </a>
        </p>
      </div>
    </div>
  </div>

  <!-- Teams -->
  <div class="second">
    <div class="primary-container">
      <h4>TEAMS</h4>
      <div class="primary">
        <h4>Number of Teams: {user.__teams__.length}</h4>
        {#each user.__teams__.reverse() as team, sn}
          <p class="item">{sn + 1}. {team.name}</p>
        {:else}
          <h4 class="error">Oops! {user.name} hasn't created Team(s)</h4>
        {/each}
      </div>
    </div>
  </div>

  <!-- Projects -->
  <div class="second">
    <div class="primary-container">
      <h4>PROJECTS</h4>
      <div class="primary">
        <h4>Number of Projects: {user.__projects__.length}</h4>
        {#each user.__projects__.reverse() as project, sn}
          <p class="item">{sn + 1}. {project.name}</p>
        {:else}
          <h4 class="error">Oops! {user.name} has no Project(s)</h4>
        {/each}
      </div>
    </div>
  </div>
</div>

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
    display: inline-block;
    padding: 0.6rem;
    background: linear-gradient(150deg, #0e639c, #ff8c00);
    margin: auto;
    border-radius: 50%;
    background-size: 260% 260%;
    animation: animated-gradient 2s linear infinite;
  }

  .image img {
    width: 130px;
    display: block;
    height: 130px;
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

  .name svg {
    margin-left: 5px;
    width: 16px;
    height: 16px;
  }

  .bio {
    padding: 10px;
    text-align: center;
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

  .first-row {
    width: 200px;
    margin-top: 5%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
  }

  .uniqueId {
    padding: 1rem;
    background-color: #313131;
    color: #fff;
    border-radius: 15px;
    cursor: pointer;
  }

  .second {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    margin-top: 10px;
  }

  .primary-container {
    width: 300px;
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
    border-bottom: 1px solid #888888;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .flairs-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .flairItem {
    background-color: #cfcfcf;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 12px;
    padding-right: 12px;
    color: #111;
    /* margin-left: 10px; */
    margin-right: 10px;
    border-radius: 20px;
    margin-top: 10px;
    cursor: pointer;
  }
</style>
