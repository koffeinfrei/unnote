<div class:hidden-sm={!showList}>
  <SearchTerm searchTerm={$searchTerm} />

  {#if collection === 'task_notes'}
    <div class="view-filter">
      <select onchange={handleTaskNoteFilterChanged}>
        <option value="">Show all</option>
        <option value="todo">Show todos</option>
      </select>
    </div>
  {/if}

  {#if $searchTerm && $notes.length === 0}
    <div>There's nothing…</div>
  {:else}
    {#each $notes as note}
      <div
        class="card list-item"
        class:active={note.uid === activeNoteUid}
        key={note.uid}
        onclick={() => handleNoteClick(note)}>

        <NotePicture {note} />

        <div class="list-item-content">
          <h4 class="list-item-heading">
            {note.title}
          </h4>
          <div class="list-item-meta tooltip-top" data-tooltip={humanDate.prettyPrint(note.updatedAt, { showTime: true })}>
            {relativeTimeUpdateTrigger && humanDate.relativeTime(note.updatedAt)}
          </div>
        </div>
        <div class="list-item-actions">
          <button name="archive-note" class='icon tooltip-top-left' data-tooltip="Archive note" onclick={event => {
                event.stopPropagation()
                dispatch('archiveNote', note)
              }}>
            <ArchiveIcon />
          </button>
          <button name="delete-note" class='icon tooltip-top-left' data-tooltip="Delete note" onclick={event => {
              event.stopPropagation()
              dispatch('deleteNote', note)
            }}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    {/each}
  {/if}

  <LoadMoreButton
    showLoadMoreButton={hasMorePages}
    showSpinner={isLoadingMorePages}
    on:loadMore={handleLoadMoreClick} />
</div>

<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import humanDate from 'human-date'
  import { ajaxWithAbort } from './ajax'
  import { show } from './flash'
  import { searchTerm } from './stores'
  import Note from './Note'
  import AlertFlash from './AlertFlash.svelte'
  import SearchTerm from './SearchTerm.svelte'
  import LoadMoreButton from './LoadMoreButton.svelte'
  import NotePicture from './NotePicture.svelte'
  import ArchiveIcon from './icons/material/archive_FILL0_wght300_GRAD0_opsz24.svg.svelte'
  import DeleteIcon from './icons/material/delete_FILL0_wght300_GRAD0_opsz24.svg.svelte'
  import { notes } from './stores.js'

  let {
    activeNoteUid,
    isSynced,
    showList,
    listNeedsUpdate,
    collection
  } = $props();

  let currentPage = 1
  let hasMorePages = $state(false)
  let isLoadingMorePages = $state(true)
  let updateListRequest
  let filter
  let relativeTimeUpdateTrigger = $state(Date.now())

  const dispatch = createEventDispatcher()

  // update the relative `updatedAt` time shown in the list. For newly created
  // notes where we show seconds the display gets stale otherwise
  setInterval(() => {
    relativeTimeUpdateTrigger = Date.now()
  }, 1000)

  const handleNoteClick = (note, e) => {
    dispatch('noteClick', note)
  }

  const handleLoadMoreClick = () => {
    isLoadingMorePages = true

    currentPage = currentPage + 1
    updateList()
  }

  const handleTaskNoteFilterChanged = (e) => {
    filter = e.target.value
    updateList()
  }

  const updateList = () => {
    if (updateListRequest) {
      updateListRequest.controller.abort()
    }

    const params = {
      search: $searchTerm,
      page: currentPage
    }

    if (filter) {
      params['filters[]'] = filter
    }

    updateListRequest = ajaxWithAbort(`/api/${collection}`, 'GET', params)

    executeUpdateListRequest()
  }

  const executeUpdateListRequest = () => {
    updateListRequest.promise
      .then((data) => {
        $notes = data.notes.map((note) => {
          return Note.fromAttributes(note)
        })

        currentPage = data.current_page
        hasMorePages = data.has_more_pages
        isLoadingMorePages = false
      })
      .catch((error) => {
        isLoadingMorePages = false

        show('alert', 'Watch out, the list is not up to date.')
        console.error('error: ', error.toString())
      })
  }
  $effect(() => {
    if (isSynced && listNeedsUpdate !== false) {
      updateList()
    }
  });
  $effect(() => {
    if ($searchTerm !== undefined) {
      updateList()
    }
  });
  $effect(() => {
    // collection changed
    if (collection !== undefined) {
      updateList()
    }
  });
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .card.list-item
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 $picnic-separation
    // needed for tooltip to be able to overflow
    overflow: visible

    &.active
      color: $picnic-primary
      border-color: $picnic-primary
      box-shadow: 1px 1px 4px $picnic-dull

    .list-item-heading
      font-weight: normal

    .list-item-content
      flex: 1 1 auto

    .list-item-meta
      font-size: $font-size-sm
      color: $gray
      margin-bottom: $picnic-separation

    .list-item-actions
      display: flex
</style>
