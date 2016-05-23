class NoteList extends React.Component {
  render () {
    var commentNodes = this.props.notes.map(function(note) {
      return (
        <div className="list-group-item">
          <div className="row-content">
            <h4 className="list-group-item-heading">
              {note.title}
            </h4>
          </div>
        </div>
      );
    });
    return (
      <div className="list-group">
        {commentNodes}
      </div>
    );}
}

NoteList.propTypes = {
  notes: React.PropTypes.array
};
