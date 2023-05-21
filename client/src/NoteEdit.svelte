{#if note}
  <NoteActionBar
    {showList}
    {isSynced}
    on:showListClicked={handleShowListClicked}
    on:newClicked={handleNewNoteClicked} />
  <div class="flex one two-900">
    <div class="full third-900 fourth-1200">
      <NoteList
        activeNoteUid={note.uid}
        {isSynced}
        {showList}
        {listNeedsUpdate}
        {collection}
        on:noteClick={handleNoteClick}
        on:deleteNote={handleDeleteNoteClick}
        on:archiveNote={handleArchiveNoteClick} />
    </div>
    <div class="full two-third-900 three-fourth-1200 padding-left-xl">
      <NoteForm
        {note}
        on:change={handleEditChange}
        showForm={!showList} />
    </div>
  </div>

  <Dialog
    title='Archive'
    text='Are you sure you want to archive this note?'
    show={showArchiveDialog}
    on:confirm={handleArchiveDialogConfirmed} />

  <Dialog
    title='Delete'
    text='Are you sure you want to delete this note?'
    show={showDeleteDialog}
    on:confirm={handleDeleteDialogConfirmed} />
{/if}

<script>
  import { onMount, beforeUpdate, onDestroy } from 'svelte'
  import { querystring } from 'svelte-spa-router'
  import { ajax } from './ajax'
  import { show } from './flash'
  import SyncStorage from './SyncStorage'
  import { setEdit, setNew, setBrowserTitle } from './pushState'
  import { searchTerm, notes } from './stores'
  import { resize } from './image'
  import { getBlob, getJson } from './cache'
  import Note from './Note'
  import EventHive from './EventHive'
  import AutoSave from './AutoSave'
  import NoteForm from './NoteForm.svelte'
  import NoteList from './NoteList.svelte'
  import NoteActionBar from './NoteActionBar.svelte'
  import Dialog from './Dialog.svelte'
  import './keyboard'

  export let params = {}
  export let collection

  let note
  let showList
  let autoSave
  let isSynced
  let listNeedsUpdate
  let noteNewSubscription
  let searchEnteredSubscription
  let searchClearedSubscription
  let showDeleteDialog
  let handleDeleteDialogConfirmed
  let showArchiveDialog
  let handleArchiveDialogConfirmed


  onMount(() => {
    noteNewSubscription = EventHive.subscribe('note.new', (data) => {
      setNewNote()
    })
  })

  beforeUpdate(async () => {
    // we can't do this in `onMount` since this happens before, and `autoSave`
    // would be `undefined`.
    if (autoSave === undefined) {
      autoSave = new AutoSave(handleServerSync)
      autoSave.startPolling()
    }

    if (!params.id) {
      note = new Note()
    }
    else if (params.id && note?.uid !== params.id) {
      // 1. try sync storage
      note = Note.fromAttributes(SyncStorage.getJson({ uid: params.id }))
      if (!note) {
        // 2. try svelte store
        note = $notes.find(note => note.uid === params.id)
        if (!note) {
          // 3. try server
          await initStateFromNoteId(params.id)
        }
      }
    }
    else if ($querystring.includes('share-target')) {
      note = new Note()

      const blob = await getBlob('shared-image')
      const json = await getJson('shared-data')
      if (blob || json) {
        if (blob) {
          const { dataUrl, width, height } = await resize(blob)

          show('notice', `The image was scaled to ${width} × ${height} px`)

          note.content = `<img src="${dataUrl}" />`
        } else {
          note.title = json.title
          note.content = [json.text, json.url].filter(x => x).join('<br/>')
        }

        setEdit(note)
        autoSave.setChange(note)
      }
    }

    if (note === undefined) {
      note = new Note()
      showList = true
    }

    setBrowserTitle(note)
  })

  onDestroy(() => {
    noteNewSubscription.remove()
    autoSave.stopPolling()
  })

  $: if ($searchTerm !== undefined) showList = true

  const initStateFromNoteId = async (id) => {
    showList = false

    try {
      const data = await ajax(`/api/notes/${id}`)
      note = Note.fromAttributes(data.note)
    } catch (error) {
      setNew()
      show('alert',
        'While trying to load the note the internet broke down (or something ' +
          'else failed, maybe the note could not be found)'
      )
    }
  }

  const handleNoteClick = (event) => {
    event.preventDefault()

    showList = false
    setEdit(event.detail)
  }

  const handleDeleteNoteClick = (e) => {
    const clickedNote = e.detail

    const handler = (event) => {
      showDeleteDialog = false

      if (event.detail) {
        isSynced = false
        deleteNote(clickedNote)
      }
    }
    showDeleteDialog = true
    handleDeleteDialogConfirmed = handler
  }

  const handleArchiveNoteClick = (e) => {
    const clickedNote = e.detail

    const handler = (event) => {
      showArchiveDialog = false

      if (event.detail) {
        clickedNote.setArchived()
        autoSave.setChange(clickedNote)
        setNewNote(() => showList = true)
      }
    }
    showArchiveDialog = true
    handleArchiveDialogConfirmed = handler
  }

  const handleNewNoteClicked = () => {
    setNewNote()
  }

  const handleShowListClicked = () => {
    setNewNote(() => showList = true)
  }

  const handleEditChange = (event) => {
    const updatedNote = event.detail
    setEdit(updatedNote)

    autoSave.setChange(updatedNote)
  }

  const handleServerSync = (data) => {
    isSynced = data.isSynced
    listNeedsUpdate = true
    // when a note has been synced we need to set the serverUpdatedAt timestamp
    // for the conflict detection to work
    // (only do this if the current note is the synced note)
    if (data.note && note.uid === data.note.uid) {
      note.serverUpdatedAt = data.note.serverUpdatedAt
    }
  }

  const setNewNote = (callback) => {
    showList = false
    if (callback) callback()
    setNew()
  }

  const deleteNote = (affectedNote) => {
    ajax(`/api/notes/${affectedNote.uid}`, 'DELETE')
      .then((data) => {
        SyncStorage.remove(affectedNote)

        if (note.uid === affectedNote.uid) {
          setNewNote()
        }

        isSynced = true
        listNeedsUpdate = true
      })
      .catch((error) => {
        let message = 'Oh my, the note could not be deleted.'
        if (!window.navigator.onLine) {
          message += "<br>Please check your internet connection (Apologies, deleting in offline mode is not yet suppported)."
        }
        show('alert', message)
        console.error('note.uid: ', note.uid, 'error: ', error.toString())

        isSynced = true
        listNeedsUpdate = false
      })
  }
</script>
