import React, { Component } from 'react';
import './keyboard';
import { ajax } from './ajax';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import Note from './Note';
import PushState from  './PushState';
import Navbar from './Navbar';
import AlertFlash from './AlertFlash';
import EventHive from './EventHive';
import AutoSave from './AutoSave';
import SyncStorage from './SyncStorage';
import Dialog from './Dialog';
import NoteActionBar from './NoteActionBar';
import Flash from './Flash';

class NoteEdit extends Component {
  constructor(props, context) {
    super(props, context);

    const { match } = this.props;

    if (props.note) {
      this.initStateFromNote(props.note);
    }
    else if (match.params.id) {
      this.initStateFromNoteId(match.params.id);
    }
    else {
      this.state = { ...this.getNewNoteAttributes(), showList: true };
    }
  }

  render() {
    return (
      <div>
        {this.renderHeaderBar()}
        {this.renderContent()}
        <Dialog
          title='Archive'
          text='Are you sure you want to archive this note?'
          show={this.state.showArchiveDialog}
          handleConfirmed={this.state.handleArchiveDialogConfirmed} />
        <Dialog
          title='Delete'
          text='Are you sure you want to delete this note?'
          show={this.state.showDeleteDialog}
          handleConfirmed={this.state.handleDeleteDialogConfirmed} />
      </div>
    );
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();

    this.noteCreateSubscription = EventHive.subscribe('note.create', (data) => {
      this.setNewNote(() => {
        EventHive.publish('note.update', data);
      });
    });

    this.noteNewSubscription = EventHive.subscribe('note.new', (data) => {
      this.setNewNote();
    });
  }

  componentWillUnmount() {
    this.noteCreateSubscription.remove();
    this.noteNewSubscription.remove();
    this.autoSave.stopPolling();
  }

  renderHeaderBar() {
    return (
      <Navbar
        isLoggedIn={true}
        handleSearchEnter={this.handleSearchEnter.bind(this)}
        handleSearchCleared={this.handleSearchCleared.bind(this)} />
    );
  }

  renderContent() {
    return (
      <main>
        <Flash />
        <NoteActionBar
          showList={this.state.showList}
          isSynced={this.state.isSynced}
          handleShowListClicked={this.handleShowListClicked.bind(this)}
          handleNewClicked={this.handleNewNoteClicked.bind(this)} />
        <div className="flex one two-900">
          <div className="full third-900 fourth-1200">
            <NoteList
              activeNoteUid={this.state.note.uid}
              isSynced={this.state.isSynced}
              showList={this.state.showList}
              searchQuery={this.state.searchQuery}
              collection={this.props.collection}
              handleNoteClick={this.handleNoteClick.bind(this)}
              handleDeleteNoteClick={this.handleDeleteNoteClick.bind(this)}
              handleArchiveNoteClick={this.handleArchiveNoteClick.bind(this)} />
          </div>
          <div className="full two-third-900 three-fourth-1200 padding-left-xl">
            <NoteForm
              note={this.state.note}
              handleChange={this.handleEditChange.bind(this)}
              showForm={!this.state.showList} />
          </div>
        </div>
      </main>
    );
  }

  /* eslint-disable react/no-direct-mutation-state */
  initStateFromNote(note) {
    this.state = {
      note: Note.fromAttributes(note)
    };
    new PushState(this.props.match, this.props.history).setBrowserTitle(note);
  }

  initStateFromNoteId(id) {
    // set new note as state, otherwise the state will be undefined
    this.state = {
      showList: false,
      ...this.getNewNoteAttributes()
    };

    ajax(`/api/notes/${id}`)
      .then((data) => {
        const note = Note.fromAttributes(data.note);
        this.setState({
          showList: false,
          note: note
        }, () => new PushState(this.props.match, this.props.history).setBrowserTitle(note));
      })
      .catch(() => {
        AlertFlash.show(
          'While trying to load the note the internet broke down (or something ' +
            'else failed, maybe the note could not be found)'
        );
      })
  }
  /* eslint-enable react/no-direct-mutation-state */

  handleNoteClick(note, e) {
    e.preventDefault();

    this.setState({ note: note, showList: false });
    const pushState = new PushState(this.props.match, this.props.history);
    pushState.setEdit(note);
    pushState.setBrowserTitle(note);
  }

  handleDeleteNoteClick(note, e) {
    e.preventDefault();
    e.stopPropagation();

    const handler = (confirmed) => {
      this.setState({ showDeleteDialog: false });

      if (confirmed) {
        this.setState({ isSynced: false });
        this.deleteNote(note);
      }
    };
    this.setState({ showDeleteDialog: true, handleDeleteDialogConfirmed: handler.bind(this) });
  }

  handleArchiveNoteClick(note, e) {
    e.preventDefault();
    e.stopPropagation();

    const handler = (confirmed) => {
      this.setState({ showArchiveDialog: false });

      if (confirmed) {
        note.setArchived();
        this.handleEditChange(note)
        this.setNewNote();
      }
    };
    this.setState({ showArchiveDialog: true, handleArchiveDialogConfirmed: handler.bind(this) });
  }

  handleNewNoteClicked() {
    this.setNewNote();
  }

  handleShowListClicked() {
    this.setNewNote(() => this.setState({ showList: true }));
  }

  handleEditChange(note) {
    new PushState(this.props.match, this.props.history).setEdit(note);

    this.autoSave.setChange(note);
  }

  handleServerSync(data) {
    let state = { isSynced: data.isSynced, listNeedsUpdate: true };
    // when a note has been synced we need to set the serverUpdatedAt timestamp
    // for the conflict detection to work
    // (only do this if the current note is the synced note)
    if (data.note && this.state.note.uid === data.note.uid) {
      state.note = this.state.note;
      state.note.serverUpdatedAt = data.note.serverUpdatedAt;
    }
    this.setState(state);

    if (data.isSynced) {
      new PushState(this.props.match, this.props.history).setBrowserTitle(this.state.note);
    }
  }

  handleSearchEnter(e) {
    // show the list in case a note was shown
    this.setState({ searchQuery: e.target.value, showList: true });
  }

  handleSearchCleared() {
    this.setState({ searchQuery: '' });
  }

  getNewNoteAttributes() {
    return { note: new Note() }
  }

  setNewNote(afterSetState) {
    this.setState({ ...this.getNewNoteAttributes(), showList: false }, afterSetState);
    const pushState = new PushState(this.props.match, this.props.history);
    pushState.setNew();
    pushState.setBrowserTitle();
  }

  deleteNote(note) {
    ajax(`/api/notes/${note.uid}`, 'DELETE')
      .then((data) => {
        SyncStorage.remove(note);

        if (this.state.note.uid === note.uid) {
          this.setNewNote();
        }

        this.setState({ isSynced: true, listNeedsUpdate: true });
      })
      .catch((error) => {
        let message = 'Oh my, the note could not be deleted.';
        if (!window.navigator.onLine) {
          message += "<br>Please check your internet connection (Apologies, deleting in offline mode is not yet suppported)."
        }
        AlertFlash.show(message);
        console.error('note.uid: ', note.uid, 'error: ', error.toString());

        this.setState({ isSynced: true, listNeedsUpdate: false });
      })
      .finally(() => {
      });
  }
}

export default NoteEdit;
