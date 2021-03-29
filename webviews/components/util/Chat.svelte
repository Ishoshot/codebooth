<script lang="ts">
  import { onMount } from "svelte";

  let message = "Hi there";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
      }
    });
  });

  function Message() {
    var theDiv = document.getElementById("comtainer");
    var content = document.createTextNode(message);
    theDiv?.appendChild(content);
  }
</script>

<div id="page-wrapper">
  <div class="container">
    <div class="row">
      <div id="comtainer" class="contain" />

      <input type="text" bind:value={message} name="message" />
      <button on:click={() => Message()}>SUBMIT</button>
    </div>
  </div>
</div>

<style scoped>
  #page-wrapper {
    position: relative;
  }

  .container {
    width: 100%;
    margin: 0 auto;
  }
</style>
