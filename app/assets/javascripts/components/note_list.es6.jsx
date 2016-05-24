class NoteList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { notes: [] };
  }

  render () {
    var commentNodes = this.state.notes.map((note) => {
      return (
        <div className="list-group-item">
          <div className="row-content">
            <h4 className="list-group-item-heading">
              <a
                href="#"
                key={note.id}
                onClick={this.props.handleNoteClick.bind(this, note)}
              >{note.title}</a>
            </h4>
          </div>
        </div>
      );
    });

    return (
      <div className="list-group">
        {commentNodes}
      </div>
    );
  }

  componentDidMount () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({ notes: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
}
