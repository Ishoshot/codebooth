<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let user: User;

  async function updatePreference(type: any, value: boolean) {
    dispatch("updatePreference", {
      type,
      value,
    });
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<div class="settings">
  <h3>Preferences</h3>
  <div class="block">
    <p class="label">Receive Notifications when followed by a user.</p>
    <label class="switch">
      <input
        type="checkbox"
        name="notify_follow"
        bind:checked={user.notify_follow}
        on:change={() => updatePreference("notify_follow", user.notify_follow)}
      />
      <span class="slider" />
    </label>
  </div>

  <div class="block">
    <p class="label">Receive Notifications when followed by a user.</p>
    <label class="switch">
      <input type="checkbox" />
      <span class="slider" />
    </label>
  </div>

  <div class="block">
    <p class="label">Receive Notifications when followed by a user.</p>
    <label class="switch">
      <input type="checkbox" />
      <span class="slider" />
    </label>
  </div>
</div>

<style scoped>
  .settings {
    display: flex;
    padding-left: 3px;
    flex-direction: column;
    justify-content: start;
  }

  .settings h3 {
    margin-top: 0.7rem;
    font-weight: bold;
  }

  .label {
    margin-top: 0.7rem;
  }

  .switch {
    margin-top: 0.7rem;
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background: var(--vscode-button-background);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--vscode-button-background);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }
</style>
