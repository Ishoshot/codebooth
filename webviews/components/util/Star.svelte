<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { User } from "../../types";

  export let activeClass: boolean = false;

  // User
  export let user: User;

  export let accessToken: string;

  let liker: User;

  function watchUser(_user: User) {
    setTimeout(() => {
      if (liker.id !== "") {
        getStarStatus();
      }
    }, 1000);
  }

  $: watchUser(user);

  /* -------------------------------- Get User ------------------------------- */
  async function getUser() {
    const response = await fetch(`${apiBaseURL}/user-light`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json();
    liker = payload.user.id;
  }

  /* -------------------------------- Check If currentUser stars User Already ------------------------------- */
  async function getStarStatus() {
    const response = await fetch(`${apiBaseURL}/star/user-status`, {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        liker_id: liker,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const payload = await response.json();
    console.log(payload);
    if (payload.star !== null) {
      activeClass = true;
    } else {
      activeClass = false;
    }
  }

  /* ----------------------------- Star User ----------------------------- */
  async function starUser() {
    if (liker == undefined) {
      tsvscode.postMessage({
        type: "onError",
        value: "LIKER: You shouldn't have to see this. Report this bug",
      });
      return;
    } else {
      const response = await fetch(`${apiBaseURL}/star/user`, {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          liker_id: liker,
        }),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.star === null) {
        tsvscode.postMessage({
          type: "onError",
          value: "Error Encountered while Starring User.",
        });
        return;
      } else if (data.code === "D") {
        activeClass = false;
        tsvscode.postMessage({
          type: "onError",
          value: "You unstarred this User.",
        });
        return;
      } else {
        activeClass = true;
        /* ------------ Show success Message  ----------- */
        tsvscode.postMessage({
          type: "onInfo",
          value: "You starred this User.",
        });
      }
    }
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
    getUser();
  });
</script>

<div class="wrapper">
  <p>
    <i
      class="fa fa-star"
      class:active={activeClass}
      class:notActive={!activeClass}
      on:click={() => starUser()}
    />
  </p>
</div>

<style scoped>
  .wrapper {
    margin: 0%;
  }

  i {
    font-size: 1.5rem;
    cursor: pointer;
  }

  .active {
    color: #ff8c00;
  }

  .notActive {
    color: #fff;
  }
</style>
