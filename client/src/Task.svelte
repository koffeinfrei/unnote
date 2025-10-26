<label class="task">
  <input
    type="checkbox"
    checked={task.done}
    onchange={handleTaskChecked} />

  <span class="checkable">{task.title}</span>
</label>

<script>
  let { note, task, checked } = $props();

  const handleTaskChecked = () => {
    checked(
      note,
      { ...task, done: !task.done }
    )
  }
</script>

<style lang="sass">
  .task
    display: block
</style>
