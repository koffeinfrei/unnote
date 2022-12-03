<div class="card">
  <header>
    {note.title}
  </header>

  <div>
    {#if todo.length > 0}
      <footer>
        {#each todo as task}
          <Task
            {note}
            {task}
            on:checked />
        {/each}
      </footer>
    {/if}
  </div>

  <div>
    {#if done.length > 0}
      <footer>
        <button name="toggle-done" class='icon left-aligned full-width' on:click={() => (showDone = !showDone)}>
          {#if showDone}
            <LessIcon />
          {:else}
            <MoreIcon />
          {/if}
        </button>

        <div class:collapsed={!showDone}>
          {#each done as task}
            <Task
              {note}
              {task}
              on:checked />
          {/each}
        </div>
      </footer>
    {/if}
  </div>
</div>

<script>
  import Task from './Task.svelte';
  import MoreIcon from './icons/material/expand_more-24px.svg.svelte';
  import LessIcon from './icons/material/expand_less_black_24dp.svg.svelte';

  export let note

  let showDone = false

  $: todo = note.tasks.filter(task => !task.done)
  $: done = note.tasks.filter(task => task.done)
</script>
