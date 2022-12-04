<label class="task">
  <input
    type="checkbox"
    checked={task.done}
    on:change={handleTaskChecked} />

  <span class="checkable">{task.title}</span>
</label>

<script>
  import { createEventDispatcher } from 'svelte';

  export let note
  export let task

  const dispatch = createEventDispatcher();

  const handleTaskChecked = (e) => {
    dispatch('checked', {
      note: note,
      task: { ...task, done: !task.done }
    });
  }
</script>

<style lang="sass">
  .task
    display: block
</style>
