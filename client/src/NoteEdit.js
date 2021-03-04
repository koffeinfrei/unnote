import React, { Component } from 'react';
import $ from 'jquery';
import { debounce } from 'throttle-debounce';
import './keyboard';
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
import SaveStateLabel from './SaveStateLabel';
import './NoteEdit.css';

import showListIcon from './icons/material/arrow_back-24px.svg';
import newIcon from './icons/material/add-24px.svg';

class NoteEdit extends Component {
  constructor(props, context) {
    super(props, context);

    this.pushState = new PushState(this.props.history);

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

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
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

    EventHive.subscribe('note.create', (data) => {
      this.setNewNote(() => {
        EventHive.publish('note.update', data);
      });
    });

    EventHive.subscribe('note.new', (data) => {
      this.setNewNote();
    });
  }

  renderHeaderBar() {
    return (
      <Navbar
        handleSearchEnter={this.handleSearchEnter.bind(this)}
        handleSearchCleared={this.handleSearchCleared.bind(this)} />
    );
  }

  renderContent() {
    return (
      <main>
        <div className="meta">
          {this.state.showList ? (
            <div className="spacer"></div>
          ) : (
            <div className="spacer">
              <button onClick={this.handleShowListClicked.bind(this)} className="icon big hidden-lg">
                <img src={showListIcon} alt="Close note" />
              </button>
            </div>
          )}

          <SaveStateLabel isSynced={this.state.isSynced} />

          <button onClick={this.handleNewNoteClick.bind(this)} className="icon big">
            <img src={newIcon} alt="New note" />
          </button>
        </div>
        <div className="flex one two-900">
          <div className="full third-900 fourth-1200">
            <NoteList
              activeNoteUid={this.state.note.uid}
              isSynced={this.state.isSynced}
              showList={this.state.showList}
              searchQuery={this.state.searchQuery}
              handleNoteClick={this.handleNoteClick.bind(this)}
              handleDeleteNoteClick={this.handleDeleteNoteClick.bind(this)}
              handleArchiveNoteClick={this.handleArchiveNoteClick.bind(this)} />
          </div>
          <div className="full two-third-900 three-fourth-1200 padding-left">
            <NoteForm
              note={this.state.note}
              handleChange={this.handleEditChange.bind(this)}
              showForm={!this.state.showList} />
          </div>
        </div>
      </main>
    );
  }

  handleShowListClicked() {
    this.setNewNote(() => this.setState({ showList: true }));
  }

  /* eslint-disable react/no-direct-mutation-state */
  initStateFromNote(note) {
    this.state = {
      note: Note.fromAttributes(note)
    };
    this.pushState.setBrowserTitle(note);
  }

  initStateFromNoteId(id) {
    // set new note as state, otherwise the state will be undefined
    this.state = {
      showList: false,
      ...this.getNewNoteAttributes()
    };

    $.ajax({
      url: `/api/notes/${id}`,
      dataType: 'json',
    })
    .done((data) => {
      const note = Note.fromAttributes(data.note);
      this.setState({
        showList: false,
        note: note
      }, () => this.pushState.setBrowserTitle(note));
    })
    .fail((xhr, status, error) => {
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
    this.pushState.setEdit(note);
    this.pushState.setBrowserTitle(note);
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

  handleNewNoteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setNewNote();
  }

  handleEditChange(note) {
    this.pushState.setEdit(note);

    this.autoSave.setChange(note);
  }

  handleServerSync(data) {
    let state = { isSynced: data.isSynced };
    // when a note has been synced we need to set the serverUpdatedAt timestamp
    // for the conflict detection to work
    // (only do this if the current note is the synced note)
    if (data.note && this.state.note.uid === data.note.uid) {
      state.note = this.state.note;
      state.note.serverUpdatedAt = data.note.serverUpdatedAt;
    }
    this.setState(state);

    if (data.isSynced) {
      this.pushState.setBrowserTitle(this.state.note);
    }
  }

  handleSearchEnter(e) {
    e.persist();
    this.handleSearchEnterDebounced(e);
  }

  handleSearchEnterDebounced(e) {
    this.setState({ searchQuery: e.target.value });
  }

  handleSearchCleared() {
    this.setState({ searchQuery: '' });
  }

  getNewNoteAttributes() {
    return { note: new Note() }
  }

  setNewNote(afterSetState) {
    this.setState({ ...this.getNewNoteAttributes(), showList: false }, afterSetState);
    this.pushState.setNew();
    this.pushState.setBrowserTitle();
  }

  deleteNote(note) {
    $.ajax({
      url: '/api/notes/' + note.uid,
      method: 'DELETE',
      dataType: 'json',
    })
    .done(() => {
      SyncStorage.remove(note);

      if (this.state.note.uid === note.uid) {
        this.setNewNote();
      }
    })
    .fail(function(xhr, status, error) {
      var message = 'Oh my, the note could not be deleted.';
      // 0 == UNSENT -> most probably no internet connection
      if (xhr.readyState === 0) {
        message += "<br>Please check your internet connection (Well yes, sorry, deleting in offline mode is not yet suppported)."
      }
      AlertFlash.show(message);
      console.error('note.uid: ', note.uid, 'status: ', status, 'error: ', error.toString());
    })
    .always(() => {
      this.setState({ isSynced: true });
    });
  }
}

export default NoteEdit;
