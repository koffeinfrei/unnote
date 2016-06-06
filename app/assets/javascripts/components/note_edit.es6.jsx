class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    if (props.uid) {
      this.state = {
        isInitialEdit: true,
        uid: props.uid,
        title: props.title,
        content: props.content
      };
    }
    else {
      this.state = this.getNewNoteAttributes();
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-4">
          <Navbar handleSearchEnter={this.handleSearchEnter.bind(this)} />
          <NoteList
            url={this.props.url}
            activeNoteUid={this.state.uid}
            isSynced={this.state.isSynced}
            isInitialEdit={this.state.isInitialEdit}
            searchQuery={this.state.searchQuery}
            handleNoteClick={this.handleNoteClick.bind(this)}
            handleDeleteNoteClick={this.handleDeleteNoteClick.bind(this)} />
        </div>
        <div className="col-md-8">
          <NoteForm
            uid={this.state.uid}
            title={this.state.title}
            content={this.state.content}
            handleChange={this.handleEditChange.bind(this)} />
          <SaveStateLabel isSynced={this.state.isSynced} />
        </div>
        <AddNoteButton handleNewNoteClick={this.handleNewNoteClick.bind(this)} />
      </div>
    );
  }

  handleNoteClick(note, e) {
    e.preventDefault();

    this.setState({ uid: note.uid, title: note.title, content: note.content });
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
      .fail(function(xhr, status, err) {
        console.error(note.uid, status, err.toString());
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
    this.setState({ searchQuery: e.target.value });
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();
  }

  getNewNoteAttributes() {
    return { title: '', content: '', uid: Uuid.generateV4() }
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
