<script lang="ts">
  import { onMount } from "svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /* ------------------------------ show Manage Users ------------------------------ */
  function showUsers() {
    tsvscode.postMessage({
      type: "show-users",
      value: undefined,
    });
  }

  /* ------------------------------ show Manage Projects ------------------------------ */
  function showProjects() {
    tsvscode.postMessage({
      type: "show-projects",
      value: undefined,
    });
  }

  /* ------------------------------ show Manage Teams ------------------------------ */
  function manageTeams() {
    tsvscode.postMessage({
      type: "manage-teams",
      value: undefined,
    });
  }

  /* ------------------------------ Toggle Module ------------------------------ */
  function toggleModule(module: string) {
    const type = "show" + module;
    dispatch(type);
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });
</script>

<div class="actions">
  <div class="action-btn">
    <button class="btnStyle-Two" on:click={() => showUsers()}
      >explore Users <i class="fa fa-users" /></button
    >
    <button class="btnStyle-Two">explore Codes <i class="fa fa-code" /></button>

    <button class="btnStyle-Two" on:click={() => manageTeams()}
      >explore Teams <i class="fa fa-user-friends" /></button
    >

    <button class="btnStyle-Two" on:click={() => showProjects()}
      >explore Projects <i class="fas fa-project-diagram" /></button
    >
  </div>
  <div class="action-btn">
    <button class="btnStyle-Four" on:click={() => toggleModule("Flairs")}
      >my Flairs <i class="fa fa-heart" /></button
    >
    <button class="btnStyle-Four">my Codes <i class="fa fa-code" /></button>

    <button class="btnStyle-Four" on:click={() => toggleModule("Teams")}
      >my Teams <i class="fa fa-user-friends" /></button
    >
    <button class="btnStyle-Four" on:click={() => toggleModule("Projects")}
      >my Projects <i class="fas fa-project-diagram" /></button
    >
  </div>
</div>

<style scoped>
  button {
    outline: none !important;
  }

  .actions {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
    width: 100%;
    padding-left: 7%;
    padding-right: 7%;
  }

  button {
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 20px;
  }

  button:active,
  button:focus {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .btnStyle-Two {
    background-color: #ececec;
    color: #1186d4;
    transition: 0.5s all;
  }

  .btnStyle-Two:hover {
    background-color: #0e639c;
    color: #ececec;
  }

  .btnStyle-Four {
    background-color: #0e639c;
    transition: 0.5s all;
  }

  .btnStyle-Four:hover {
    background-color: #ececec;
    color: #0e639c;
  }

  .action-btn button {
    margin-top: 4%;
    margin-bottom: 4%;
  }
</style>
