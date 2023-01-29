<ActionBar
  on:newClicked={() => push('/notes')}
  {isSynced} />

<div class="flex one">
  <div class="full">
    <SearchTerm searchTerm={$searchTerm} />
    <div class="view-filter">
      <select name="view-filter" on:change={handleFilterChanged}>
        <option value="todo">Show todos</option>
        <option value="">Show all</option>
      </select>
    </div>

    {#if notes.length === 0}
      <div>There's nothing…</div>
    {/if}

    {#each notes as note}
      <TaskGroup
        {note}
        on:checked={handleTaskChecked} />
    {/each}

    <LoadMoreButton
      showLoadMoreButton={hasMorePages}
      showSpinner={isLoadingMorePages}
      on:loadMore={handleLoadMoreClick} />
  </div>
</div>

<script>
  import { onMount, onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { ajax } from './ajax'
  import { searchTerm } from './stores'
  import AutoSave from './AutoSave'
  import Note from './Note'
  import Navbar from './Navbar.svelte'
  import ActionBar from './ActionBar.svelte'
  import Flash from './Flash.svelte'
  import TaskGroup from './TaskGroup.svelte'
  import SearchTerm from './SearchTerm.svelte'
  import LoadMoreButton from './LoadMoreButton.svelte'

  // FIXME: params are unused. this is just to suppress the svelte warning `was created with unknown prop 'params'`
  export let params = {}

  let notes = []
  let currentPage = 1
  let filter = 'todo'
  let hasMorePages = false
  let isLoadingMorePages = true
  let isSynced
  let autoSave

  const handleTaskChecked = (e) => {
    const { note, task } = e.detail

    // update the task so the change is immediately rendered, otherwise the UI
    // updates only after the next auto poll cycle is done.
    const associatedNote = notes.find(collectionNote => collectionNote.uid === note.uid)
    const taskIndex = associatedNote.tasks.findIndex(collectionTask => collectionTask.id === task.id)
    associatedNote.tasks[taskIndex] = task

    // create a temporary html element so we can easily query the task element
    // and toggle the checked class
    const noteContentElement = document.createElement('div')
    noteContentElement.innerHTML = note.content
    const taskElement = noteContentElement.querySelector(`[data-task-id="${task.id}"]`)
    taskElement.classList.toggle('checked')

    associatedNote.content = noteContentElement.innerHTML

    autoSave.setChange(Note.fromAttributes(associatedNote))
  }

  const handleServerSync = (data) => {
    if (data.isSynced) {
      fetchTasks()
    }
    isSynced = data.isSynced
  }

  $: if ($searchTerm || true) fetchTasks()

  const handleFilterChanged = (e) => {
    filter = e.target.value
    fetchTasks()
  }

  const handleLoadMoreClick = (e) => {
    isLoadingMorePages = true

    currentPage = currentPage + 1
    fetchTasks()
  }

  const fetchTasks = () => {
    const params = {
      search: $searchTerm,
      page: currentPage
    }

    if (filter) {
      params['filters[]'] = filter
    }

    ajax('/api/task_notes', 'GET', params)
      .then((data) => {
        notes = data.notes
        hasMorePages = data.has_more_pages
        isLoadingMorePages = false
      })
      .catch((error) => {
        show('alert', 'Fetching the tasks failed.')
        console.error('error: ', error.toString())
      })
  }

  onMount(() => {
    autoSave = new AutoSave(handleServerSync)
    autoSave.startPolling()
  })

  onDestroy(() => {
    autoSave.stopPolling()
  })
</script>
