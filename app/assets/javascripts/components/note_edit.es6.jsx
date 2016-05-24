class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { note: { title: '', content: '', id: Math.random().toString(36).substr(2) } };
  }

  render() {
    return (
      <div>
        <div className="col-md-4">
          <NoteList url={this.props.url} handleNoteClick={this.handleNoteClick.bind(this)} />
        </div>
        <div className="col-md-8">
          <NoteForm note={this.state.note} />
        </div>
      </div>
    );
  }

  handleNoteClick(note, e) {
    e.preventDefault();

    this.setState({ note: note });
    history.pushState({}, "", "/notes/" + note.id + "/edit");
  }

  componentDidMount() {
    new AutoSave().startPolling();
  }
}
