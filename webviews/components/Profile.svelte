<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";

  export let user: User;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });

  /* ---------------------- Format Date to Readable form ---------------------- */
  function renderDate(val: string | number | Date): string {
    const date = new Date(val);
    return date.toDateString() + " @ " + date.toLocaleTimeString();
  }

  /* --------------------------------- LogOut --------------------------------- */
  function logOut() {
    dispatch("logout", undefined);
  }
</script>

<div class="profile">
  <!-- First Widget -->
  <div class="first">
    <div class="image">
      <img src={user.image} alt="avatar" />
    </div>

    <p class="name">
      {user.name}
      {#if user.is_verified}
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

    <p class="bio">{user.description}</p>

    <div class="flairs-row">
      {#each user.flairs.reverse() as flair}
        <!-- Display Flairs -->
        <span class="flairItem">{flair.name}</span>
      {:else}
        <!-- Flair's Empty -->
        <h4>Oops 😔 ! this.user.flairs.isEmpty(); //true</h4>
      {/each}
    </div>

    <div class="first-row">
      <p class="uniqueId">#{user.github_id}</p>
      <i
        style="margin-right: 1.5rem; cursor:pointer;"
        class="fa fa-share-alt fa-2x"
      />
      <i
        style="margin-right: 1.5rem; color:#dd2d27; cursor:pointer;"
        class="fa fa-sign-out-alt fa-2x"
        on:click={() => logOut()}
      />
    </div>

    <div class="follow-info">
      <span class="following">{user.follows_count} Following</span>
      <span class="followers">{user.followers_count} Followers</span>
    </div>
  </div>

  <div class="second">
    <div class="primary-container">
      <h3>PRIMARY INFO</h3>
      <div class="primary">
        <p><i class="fa fa-user" /> Name: {user.name}</p>
        <p><i class="fa fa-envelope" /> Email: {user.email}</p>
      </div>
    </div>

    <div class="secondary-container">
      <h3>SECONDARY INFO</h3>
      <div class="secondary">
        <p>
          <i class="fa fa-home" /> Work: {user.company ? user.company : ""}
        </p>
        <p><i class="fa fa-map-marker" /> Location: {user.location}</p>
        <p>
          <i class="fa fa-calendar" /> Joined: {renderDate(user.created_at)}
        </p>
      </div>
    </div>

    <div class="social-container">
      <h3>SOCIALS</h3>
      <div class="social">
        <p>
          GITHUB: <a href={user.github_url}>
            <i class="fab fa-github fa-2x" />
          </a>
        </p>
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
    margin-top: 2rem;
  }

  .image {
    display: inline-block;
    padding: 0.5rem;
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
    margin-top: 1.5rem;
    font-size: 1.5rem;
  }

  .name svg {
    margin-left: 5px;
    width: 16px;
    height: 16px;
  }

  .bio {
    margin-top: 0.6rem;
    padding: 10px;
    text-align: center;
  }

  .flairs-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .flairItem {
    background-color: var(--vscode-button-secondaryBackground);
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-right: 0.6rem;
    border-radius: 1rem;
    margin-top: 0.2rem;
    cursor: pointer;
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
    margin-top: 1.5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: start;
  }

  .uniqueId {
    padding: 0.85rem;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border-radius: 15px;
    cursor: pointer;
    margin-right: 1.5rem;
  }

  .second {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    margin-top: 8%;
  }

  .primary-container {
    width: 90vw;
    margin-top: 1rem;
  }

  .primary-container > h3 {
    font-weight: bold;
    font-family: "Courier New", Courier, monospace;
  }

  .primary {
    background-color: var(--vscode-button-background);
    padding: 1rem;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 1rem;
    color: var(--vscode-button-foreground);
  }

  .primary > p {
    border-bottom: 1px solid var(--vscode-foreground);
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .secondary-container {
    width: 90vw;
    margin-top: 2rem;
  }

  .secondary-container > h3 {
    font-weight: bold;
    font-family: "Courier New", Courier, monospace;
  }

  .secondary {
    background-color: var(--vscode-button-background);
    padding: 1rem;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 1rem;
    color: var(--vscode-button-foreground);
  }

  .secondary > p {
    border-bottom: 1px solid var(--vscode-foreground);
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .social-container {
    width: 90vw;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .social-container > h3 {
    font-weight: bold;
    font-family: "Courier New", Courier, monospace;
  }

  .social {
    background-color: var(--vscode-button-background);
    padding: 1rem;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 1rem;
    color: var(--vscode-button-foreground);
  }

  .social > p {
    border-bottom: 1px solid var(--vscode-foreground);
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .follow-info {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .follow-info .followers {
    margin-left: 20px;
  }
</style>
