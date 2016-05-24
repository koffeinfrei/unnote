class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { title: '', content: '', id: Math.random().toString(36).substr(2) };
  }

  render() {
    return (
      <div>
        <div className="col-md-4">
          <NoteList url={this.props.url} handleNoteClick={this.handleNoteClick.bind(this)} />
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

  handleAfterCreate(note) {
    this.setState({ id: note.id });
  }

  componentDidMount() {
    new AutoSave(this.handleAfterCreate.bind(this)).startPolling();
  }
}
