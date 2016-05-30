class NoteList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { notes: [], isSynced: false };
  }

  render() {
    var commentNodes = this.state.notes.map((note) => {
      return (
        <div className="list-group-item" key={note.uid}>
          <div className="row-action-primary">
            <i className="material-icons">note</i>
          </div>
          <div className="row-content">
            <div class="least-content">
              {moment(note.created_at).fromNow()}
            </div>
            <h4 className="list-group-item-heading">
              <a
                href="#"
                onClick={this.props.handleNoteClick.bind(this, note)}
              >{note.title}</a>
            </h4>
          </div>
          <div className="list-group-separator"></div>
        </div>
      );
    });

    return (
      <div className="list-group">
        {commentNodes}
      </div>
    );
  }

  componentDidUpdate() {
    if (this.listNeedsUpdate) {
      this.listNeedsUpdate = false;
      this.updateList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isSynced && nextProps.isSynced) {
      this.listNeedsUpdate = true;
    }

    this.setState( { isSynced: nextProps.isSynced });
  }

  updateList() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: (data) => {
        this.setState({ notes: data });
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
}
