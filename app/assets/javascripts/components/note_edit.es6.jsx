class NoteEdit extends React.Component {
  render () {
    return (
      <div>
        <div className="col-md-4">
          <NoteList url={this.props.url} />
        </div>
        <div className="col-md-8">
          <NoteForm url={this.props.url} />
        </div>
      </div>
    );
  }
}
