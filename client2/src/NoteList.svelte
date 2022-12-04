<div class:hidden-sm={!showList}>
  <SearchTerm {searchQuery} />

  {#if collection === 'task_notes'}
    <div class="view-filter">
      <select on:change={handleTaskNoteFilterChanged}>
        <option value="">Show all</option>
        <option value="todo">Show todos</option>
      </select>
    </div>
  {/if}

  {#if searchQuery && notes.length === 0}
    <div>There's nothing…</div>
  {:else}
    {#each notes as note}
      <div
        class="card list-item"
        class:active={note.uid === activeNoteUid}
        key={note.uid}
        on:click={() => handleNoteClick(note)}>

        <NotePicture {note} />

        <div class="list-item-content">
          <h4 class="list-item-heading">
            {note.title}
          </h4>
          <div class="list-item-meta tooltip-top" data-tooltip={humanDate.prettyPrint(note.updatedAt, { showTime: true })}>
            {humanDate.relativeTime(note.updatedAt)}
          </div>
        </div>
        <div class="list-item-actions">
          <button name="archive-note" class='icon' on:click={event => {
                event.stopPropagation()
                dispatch('archiveNote', note)
              }}>
            <ArchiveIcon />
          </button>
          <button name="delete-note" class='icon' on:click={event => {
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
  import { createEventDispatcher, onMount, beforeUpdate } from 'svelte'
  import humanDate from 'human-date'
  import { ajaxWithAbort } from './ajax'
  import { show } from './flash'
  import Note from './Note'
  import AlertFlash from './AlertFlash.svelte'
  import SearchTerm from './SearchTerm.svelte'
  import LoadMoreButton from './LoadMoreButton.svelte'
  import NotePicture from './NotePicture.svelte'
  import ArchiveIcon from './icons/material/archive-24px.svg.svelte'
  import DeleteIcon from './icons/material/delete-24px.svg.svelte'

  export let activeNoteUid
  export let isSynced
  export let showList
  export let searchQuery
  export let listNeedsUpdate
  export let collection

  let notes = []
  let currentPage = 1
  let hasMorePages = false
  let isLoadingMorePages = true
  let updateListRequest
  let filter

  const dispatch = createEventDispatcher()

  // TODO: check if this is the same as before
  $: {
    if (isSynced && listNeedsUpdate !== false) {
      updateList()
    }

    if (searchQuery !== undefined) {
      updateList()
    }

    // collection changed
    if (collection !== undefined) {
      updateList()
    }
  }
  // onMount(() => {
  //   if (listNeedsUpdate) {
  //     this.listNeedsUpdate = false
  //     this.updateList()
  //   }
  // })

  // beforeUpdate((nextProps) => {
  //   if (!isSynced && nextProps.isSynced && nextProps.listNeedsUpdate !== false) {
  //     this.listNeedsUpdate = true
  //   }

    // if (this.state.searchQuery !== nextProps.searchQuery) {
    //   this.listNeedsUpdate = true
    // }

    // collection changed
    // if (this.props.collection !== nextProps.collection) {
    //   this.listNeedsUpdate = true
    // }

    // this.setState( {
    //   isSynced: nextProps.isSynced,
    //   searchQuery: nextProps.searchQuery
    // })
  // })

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
      search: searchQuery,
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
        notes = data.notes.map((note) => {
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
</script>

<style lang="sass">
  @import './stylesheets/variables'

  $picture-size: 2.5em

  .card.list-item
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 $picnic-separation

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
