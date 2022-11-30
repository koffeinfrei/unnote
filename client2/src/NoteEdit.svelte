{#if note}
<!-- <div> -->
  <Navbar
    isLoggedIn={true}
    on:searchEnter={handleSearchEnter}
    on:searchCleared={handleSearchCleared} />

  <main>
    <Flash />
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
          {searchQuery}
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
  </main>

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
<!-- </div> -->
{/if}

<script>
  import { onMount, onDestroy } from 'svelte';
  import { ajax } from './ajax';
  import { show } from './flash';
  import SyncStorage from './SyncStorage';
  import Note from './Note';
  import EventHive from './EventHive';
  import AutoSave from './AutoSave';
  import Flash from './Flash.svelte';
  import NoteForm from './NoteForm.svelte';
  import NoteList from './NoteList.svelte';
  import Navbar from './Navbar.svelte';
  import NoteActionBar from './NoteActionBar.svelte';
  import Dialog from './Dialog.svelte';

  export let note
  export let params = {}
  export let collection

  let showList
  let autoSave
  let isSynced
  let listNeedsUpdate
  let searchQuery
  let noteCreateSubscription
  let noteNewSubscription
  let showDeleteDialog
  let handleDeleteDialogConfirmed
  let showArchiveDialog
  let handleArchiveDialogConfirmed

  onMount(() => {
    if (note) {
      initStateFromNote(note);
    }
    else if (params.id) {
      initStateFromNoteId(params.id);
    }
    else {
      note = new Note()
      showList = true
    }

    autoSave = new AutoSave(handleServerSync);
    autoSave.startPolling();

    noteCreateSubscription = EventHive.subscribe('note.create', (data) => {
      setNewNote(() => {
        EventHive.publish('note.update', data);
      });
    });

    noteNewSubscription = EventHive.subscribe('note.new', (data) => {
      setNewNote();
    });
  })

  onDestroy(() => {
    noteCreateSubscription.remove();
    noteNewSubscription.remove();
    autoSave.stopPolling();
  })

  const initStateFromNote = (fromNote) => {
    note = Note.fromAttributes(fromNote)
    // TODO
    // new PushState(this.props.match, this.props.history).setBrowserTitle(note);
  }

  const initStateFromNoteId = (id) => {
    // set new note as state, otherwise the state will be undefined
    showList = false
    note = new Note()

    ajax(`/api/notes/${id}`)
      .then((data) => {
        note = Note.fromAttributes(data.note);
        showList = false
        // new PushState(this.props.match, this.props.history).setBrowserTitle(note));
      })
      .catch(() => {
        show('alert',
          'While trying to load the note the internet broke down (or something ' +
            'else failed, maybe the note could not be found)'
        );
      })
  }

  const handleNoteClick = (event) => {
    event.preventDefault();

    note = event.detail
    showList = false
    // TODO
    // const pushState = new PushState(this.props.match, this.props.history);
    // pushState.setEdit(note);
    // pushState.setBrowserTitle(note);
  }

  const handleDeleteNoteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const clickedNote = e.detail

    const handler = (event) => {
      showDeleteDialog = false

      if (event.detail) {
        isSynced = false
        deleteNote(clickedNote);
      }
    };
    showDeleteDialog = true
    handleDeleteDialogConfirmed = handler
  }

  const handleArchiveNoteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const clickedNote = e.detail

    const handler = (event) => {
      showArchiveDialog = false

      if (event.detail) {
        clickedNote.setArchived();
        handleEditChange(e)
        setNewNote();
      }
    };
    showArchiveDialog = true
    handleArchiveDialogConfirmed = handler
  }

  const handleNewNoteClicked = () => {
    setNewNote();
  }

  const handleShowListClicked = () => {
    setNewNote(() => showList = true);
  }

  const handleEditChange = (event) => {
    const updatedNote = event.detail
    // new PushState(this.props.match, this.props.history).setEdit(note);

    autoSave.setChange(updatedNote);
  }

  const handleServerSync = (data) => {
    isSynced = data.isSynced
    listNeedsUpdate: true
    // when a note has been synced we need to set the serverUpdatedAt timestamp
    // for the conflict detection to work
    // (only do this if the current note is the synced note)
    if (data.note && note.uid === data.note.uid) {
      note.serverUpdatedAt = data.note.serverUpdatedAt;
    }

    if (data.isSynced) {
      // new PushState(this.props.match, this.props.history).setBrowserTitle(this.state.note);
    }
  }

  const handleSearchEnter = (event) => {
    searchQuery = event.detail
    // show the list in case a note was shown
    showList = true
  }

  const handleSearchCleared = () => {
    searchQuery = ''
  }

  const setNewNote = (callback) => {
    note = new Note()
    showList = false
    if (callback) callback()
    // const pushState = new PushState(this.props.match, this.props.history);
    // pushState.setNew();
    // pushState.setBrowserTitle();
  }

  const deleteNote = (affectedNote) => {
    ajax(`/api/notes/${affectedNote.uid}`, 'DELETE')
      .then((data) => {
        SyncStorage.remove(affectedNote);

        if (note.uid === affectedNote.uid) {
          setNewNote();
        }

        isSynced = true
        listNeedsUpdate = true
      })
      .catch((error) => {
        let message = 'Oh my, the note could not be deleted.';
        if (!window.navigator.onLine) {
          message += "<br>Please check your internet connection (Apologies, deleting in offline mode is not yet suppported)."
        }
        show('alert', message);
        console.error('note.uid: ', note.uid, 'error: ', error.toString());

        isSynced = true
        listNeedsUpdate = false
      })
  }
</script>
