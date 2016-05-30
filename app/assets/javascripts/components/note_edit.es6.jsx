class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = this.getNewNoteAttributes();
  }

  render() {
    return (
      <div>
        <div className="col-md-4">
          <Navbar />
          <NoteList
            url={this.props.url}
            isSynced={this.state.isSynced}
            handleNoteClick={this.handleNoteClick.bind(this)} />
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
    history.pushState({}, "", "/notes/" + note.uid + "/edit");
  }

  handleNewNoteClick(e) {
    e.preventDefault();

    this.setState(this.getNewNoteAttributes());
  }

  handleEditChange(note) {
    this.autoSave.setChange(note);
  }

  handleServerSync(data) {
    this.setState(data);
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();
  }

  getNewNoteAttributes() {
    return { title: '', content: '', uid: Uuid.generateV4() }
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
