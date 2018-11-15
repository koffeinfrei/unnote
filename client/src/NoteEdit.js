import React, { Component } from 'react';
import $ from 'jquery';
import debounce from 'throttle-debounce/debounce';
import bootbox from 'bootbox';
import './keyboard';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import Note from './Note';
import PushState from  './PushState';
import Navbar from './Navbar';
import SaveStateLabel from './SaveStateLabel';
import AddNoteButton from './AddNoteButton';
import AlertFlash from './AlertFlash';
import EventHive from './EventHive';
import AutoSave from './AutoSave';

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
      this.state = this.getNewNoteAttributes();
    }

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div>
        {this.renderHeaderBar()}
        {this.renderContent()}
      </div>
    );
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();

    EventHive.subscribe('note.create', (data) => {
      this.setNewNote(() => {
        EventHive.publish('hamburger.hide');
        EventHive.publish('note.update', data);
      });
    });

    EventHive.subscribe('note.new', (data) => {
      this.setNewNote();
    });
  }

  renderHeaderBar() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="navbar navbar-fixed-top navbar-info navbar-notes">
            <Navbar
              handleSearchEnter={this.handleSearchEnter.bind(this)}
              handleSearchCleared={this.handleSearchCleared.bind(this)} />

            <SaveStateLabel isSynced={this.state.isSynced} />
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="row">
        <div className="col-md-4">
          <NoteList
            activeNoteUid={this.state.note.uid}
            isSynced={this.state.isSynced}
            isInitialEdit={this.state.isInitialEdit}
            searchQuery={this.state.searchQuery}
            handleNoteClick={this.handleNoteClick.bind(this)}
            handleDeleteNoteClick={this.handleDeleteNoteClick.bind(this)}
            handleArchiveNoteClick={this.handleArchiveNoteClick.bind(this)} />
        </div>
        <div className="col-md-8">
          <NoteForm
            note={this.state.note}
            handleChange={this.handleEditChange.bind(this)} />
        </div>
        <AddNoteButton handleNewNoteClick={this.handleNewNoteClick.bind(this)} />
      </div>
    );
  }

  /* eslint-disable react/no-direct-mutation-state */
  initStateFromNote(note) {
    this.state = {
      isInitialEdit: true,
      note: Note.fromAttributes(note)
    };
    this.pushState.setBrowserTitle(note);
  }

  initStateFromNoteId(id) {
    // set new note as state, otherwise the state will be undefined
    this.state = {
      ...this.getNewNoteAttributes(),
      isInitialEdit: true
    };

    $.ajax({
      url: `/api/notes/${id}`,
      dataType: 'json',
    })
    .done((data) => {
      const note = Note.fromAttributes(data.note);
      this.setState({
        isInitialEdit: true,
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

    this.setState({ note: note });
    this.pushState.setEdit(note);
    this.pushState.setBrowserTitle(note);
  }

  handleDeleteNoteClick(note, e) {
    e.preventDefault();
    e.stopPropagation();

    bootbox.confirm('Are you sure? <br> The note will be permanently deleted.', (result) => {
      if (!result) { return; }

      this.setState({ isSynced: false });

      this.deleteNote(note);
    });
  }

  handleArchiveNoteClick(note, e) {
    e.preventDefault();
    e.stopPropagation();

    bootbox.confirm('Are you sure you want to archive this note?', (result) => {
      if (!result) { return; }

      note.setArchived();
      this.handleEditChange(note)
      this.setNewNote();
    });
  }

  handleNewNoteClick() {
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
    EventHive.publish('search.entered');
  }

  handleSearchCleared() {
    this.setState({ searchQuery: '' });
    EventHive.publish('search.entered');
  }

  getNewNoteAttributes() {
    return { note: new Note() }
  }

  setNewNote(afterSetState) {
    this.setState(this.getNewNoteAttributes(), afterSetState);
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
      localStorage.removeItem('note-' + note.uid);

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
