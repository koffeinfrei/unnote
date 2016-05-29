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
            id={this.state.id}
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

    this.setState({ id: note.id, title: note.title, content: note.content });
    history.pushState({}, "", "/notes/" + note.id + "/edit");
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
    return { title: '', content: '', id: Math.random().toString(36).substr(2) }
  }
}
