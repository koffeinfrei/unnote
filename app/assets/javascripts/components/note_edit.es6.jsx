class NoteEdit extends React.Component {
  render () {
    return (
      <div>
        <div className="col-md-4">
          <NoteList notes={this.props.notes} />
        </div>
        <div className="col-md-8">
          <NoteForm title={this.props.note.title} content={this.props.note.content} />
        </div>
      </div>
    );
  }
}

NoteEdit.propTypes = {
  notes: React.PropTypes.array,
  note: React.PropTypes.object
};
