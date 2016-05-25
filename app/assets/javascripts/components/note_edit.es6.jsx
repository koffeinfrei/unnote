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
          <NoteList url={this.props.url} handleNoteClick={this.handleNoteClick.bind(this)} />
          <AddNoteButton handleNewNoteClick={this.handleNewNoteClick.bind(this)} />
        </div>
        <div className="col-md-8">
          <NoteForm id={this.state.id} title={this.state.title} content={this.state.content} />
        </div>
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

  handleAfterCreate(note) {
    this.setState({ id: note.id });
  }

  componentDidMount() {
    new AutoSave(this.handleAfterCreate.bind(this)).startPolling();
  }

  getNewNoteAttributes() {
    return { title: '', content: '', id: Math.random().toString(36).substr(2) }
  }
}
