<label class="task">
  <input
    type="checkbox"
    checked={task.done}
    onchange={handleTaskChecked} />

  <span class="checkable">{task.title}</span>
</label>

<script>
  import { createEventDispatcher } from 'svelte'

  let { note, task } = $props();

  const dispatch = createEventDispatcher()

  const handleTaskChecked = () => {
    dispatch('checked', {
      note: note,
      task: { ...task, done: !task.done }
    })
  }
</script>

<style lang="sass">
  .task
    display: block
</style>
