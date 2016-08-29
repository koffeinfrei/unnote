class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    if (props.note) {
      this.state = {
        isInitialEdit: true,
        note: Note.fromAttributes(props.note)
      };
    }
    else {
      this.state = this.getNewNoteAttributes();
    }

    this.handleSearchEnterDebounced = $.debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="navbar navbar-info navbar-notes">
              <Navbar handleSearchEnter={this.handleSearchEnter.bind(this)} />
              <SaveStateLabel isSynced={this.state.isSynced} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <NoteList
              url={this.props.url}
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
    history.pushState({}, '', '/notes/' + note.uid + '/edit');
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

  handleNewNoteClick(e) {
    e.preventDefault();
    this.setNewNote();
  }

  handleEditChange(note) {
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
  }

  handleSearchEnter(e) {
    e.persist();
    this.handleSearchEnterDebounced(e);
  }

  handleSearchEnterDebounced(e) {
    this.setState({ searchQuery: e.target.value });
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();
  }

  getNewNoteAttributes() {
    return { note: new Note() }
  }

  setNewNote() {
    this.setState(this.getNewNoteAttributes());
    history.pushState({}, '', '/notes');
  }
}
