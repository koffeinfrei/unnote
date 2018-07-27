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

    const { match } = this.props;

    if (props.note) {
      this.state = {
        isInitialEdit: true,
        note: Note.fromAttributes(props.note)
      };
      PushState.setBrowserTitle(props.note);
    }
    else if (match.params.id) {
      // set new note as state, otherwise the state will be undefined
      this.state = Object.assign(this.getNewNoteAttributes(), { isInitialEdit: true });

      $.ajax({
        url: `/api/notes/${match.params.id}`,
        dataType: 'json',
      })
      .done((data) => {
        this.setState({
          isInitialEdit: true,
          note: Note.fromAttributes(data.note)
        });
      })
      .fail((xhr, status, error) => {
        AlertFlash.show(
          'While trying to load the note the internet broke down (or something ' +
          'else failed, maybe the note could not be found)'
        );
      })
    }
    else {
      this.state = this.getNewNoteAttributes();
    }

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div>
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
        <div className="row">
          <div className="col-md-4">
            <NoteList
              activeNoteUid={this.state.note.uid}
              isSynced={this.state.isSynced}
              isInitialEdit={this.state.isInitialEdit}
              searchQuery={this.state.searchQuery}
              handleNoteClick={this.handleNoteClick.bind(this)}
              handleDeleteNoteClick={this.handleDeleteNoteClick.bind(this)} />
          </div>
          <div className="col-md-8">
            <NoteForm
              note={this.state.note}
              handleChange={this.handleEditChange.bind(this)} />
          </div>
          <AddNoteButton handleNewNoteClick={this.handleNewNoteClick.bind(this)} />
        </div>
      </div>
    );
  }

  handleNoteClick(note, e) {
    e.preventDefault();

    this.setState({ note: note });
    PushState.setEdit(note);
  }

  handleDeleteNoteClick(note, e) {
    e.preventDefault();
    e.stopPropagation();

    bootbox.confirm('Are you sure? <br> The note will be permanently deleted.', (result) => {
      if (!result) {
        return;
      }

      this.setState({ isSynced: false });

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
          message += "Please check your internet connection (Well yes, sorry, deleting in offline mode is not yet suppported)."
        }
        AlertFlash.show(message);
        console.error('note.uid: ', note.uid, 'status: ', status, 'error: ', error.toString());
      })
      .always(() => {
        this.setState({ isSynced: true });
      });
    });
  }

  handleNewNoteClick() {
    this.setNewNote();
  }

  handleEditChange(note) {
    // set note url when a new note is saved (aka. created)
    if (['/', '/notes', '/notes/'].includes(window.location.pathname)) {
      PushState.setEdit(note);
    }

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
      PushState.setBrowserTitle(this.state.note);
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

  getNewNoteAttributes() {
    return { note: new Note() }
  }

  setNewNote(afterSetState) {
    this.setState(this.getNewNoteAttributes(), afterSetState);
    PushState.setNew();
  }
}

export default NoteEdit;
