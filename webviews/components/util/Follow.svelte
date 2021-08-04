<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { User } from "../../types";

  // User
  export let user: User;
  export let accessToken: string;

  /* ----------------------------- Follow User ----------------------------- */
  async function follow() {
    const response = await fetch(`${apiBaseURL}/users/${user.id}/follow`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (response.status == 200) {
      user.followers_count = user.followers_count + 1;
      user.isFollowingUser = true;
      tsvscode.postMessage({
        type: "onInfo",
        value: data.message,
      });
    } else {
      tsvscode.postMessage({
        type: "onError",
        value: data.message,
      });
    }
  }

  /* ----------------------------- UnFollow User ----------------------------- */
  async function unfollow() {
    const response = await fetch(`${apiBaseURL}/users/${user.id}/unfollow`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (response.status == 200) {
      user.followers_count = user.followers_count - 1;
      user.isFollowingUser = false;
      tsvscode.postMessage({
        type: "onInfo",
        value: data.message,
      });
    } else {
      tsvscode.postMessage({
        type: "onError",
        value: data.message,
      });
    }
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<div class="contain">
  {#if user.isFollowingUser}
    <button class="following" on:click={() => unfollow()}>following</button>
  {:else}
    <button class="follow" on:click={() => follow()}>follow</button>
  {/if}
</div>

<style scoped>
  .following {
    background: var(--vscode-button-foreground);
    color: var(--vscode-button-background);
  }
</style>
