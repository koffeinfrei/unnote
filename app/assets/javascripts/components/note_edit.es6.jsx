class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    if (props.uid) {
      this.state = {
        isInitialEdit: true,
        note: Note.fromAttributes(props)
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

        if (this.state.uid === note.uid) {
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
    this.setState(data);
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
    // TODO: generate default values in Note class
    return { note: new Note(Uuid.generateV4(), '', '') }
  }

  setNewNote() {
    this.setState(this.getNewNoteAttributes());
    history.pushState({}, '', '/notes');
  }
}

// FIXME: can't seem to require it from an external file
// because of server side rendering
class Uuid  {
  static generateV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
