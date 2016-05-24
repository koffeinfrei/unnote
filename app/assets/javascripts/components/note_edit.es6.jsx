class NoteEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { note: { title: '', content: '' } };
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
  }
}
