<script type="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /* -------------------------- Dispatch Mark as Read ------------------------- */
  function gitHubAuth() {
    dispatch("githubauth");
  }
</script>

<div class="contain">
  <!-- GitHub Login -->
  <button class="github secondary" on:click={() => gitHubAuth()}>
    LOG IN WITH GITHUB <i class="fi fi-github" />
  </button>
</div>

<style scoped>
  .contain {
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .github {
    margin-top: 2rem;
    width: 250px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    font-size: 0.9rem;
  }
</style>
