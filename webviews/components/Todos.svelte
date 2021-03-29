<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";

  export let user: User;
  export let accessToken: string;

  let todos: Array<any> = [];

  let text = "";

  async function addTodo(val: string) {
  
    const response = await fetch(`${apiBaseURL}/todo`, {
      method: "POST",
      body: JSON.stringify({
        text: val
      }),headers: {
        'content-type': "application/json",
          authorization: `Bearer ${accessToken}`,
        },
    });

    const payload = await response.json();
    todos = [payload.todo, ...todos];
    text = "";
  }


  async function updateTodo(val: number) {
  
    const response = await fetch(`${apiBaseURL}/todo`, {
      method: "PUT",
      body: JSON.stringify({
        id: val
      }),headers: {
        'content-type': "application/json",
          authorization: `Bearer ${accessToken}`,
        },
    });

    const payload = await response.json();
    if(payload.todo !== ""){
      getTodos();
    }
  }


  async function getTodos() {
    const response = await fetch(`${apiBaseURL}/todo`, {
      method: "GET",
     headers: {
        'content-type': "application/json",
          authorization: `Bearer ${accessToken}`,
        },
    });

    const payload = await response.json();
    console.log(payload);
    todos = payload.todos
  }


  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case "new-todo":
          addTodo(message.value);
          break;
      }
    });

    getTodos();

  });
</script>
 
<h4>Hello, {user.name}</h4>

<form action="" method="" on:submit|preventDefault={async () => {
  addTodo(text)
}}>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.id)}
    <li class={todo.completed ? "isComplete" : ""}>
      {todo.text} <input type="checkbox" bind:checked={todo.completed} on:change={()=>{updateTodo(todo.id)}} />
    </li>
    <pre>
    {JSON.stringify(todo, null, 2)}
</pre>
  {/each}
</ul>



<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info Message",
    });
  }}
>
  INFO
</button>

<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "Error Message",
    });
  }}
>
  ERROR
</button>

<style>
  .isComplete {
    text-decoration: line-through;
  }
</style>
