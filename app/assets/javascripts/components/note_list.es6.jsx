class NoteList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { notes: [], isSynced: false, searchQuery: '' };
  }

  render() {
    var commentNodes = this.state.notes.map((note) => {
      return (
        <div key={note.uid}>
          <div
            className={this.getItemCssClass(note)}
            onClick={this.handleNoteClick.bind(this, note)}>

            <div className="row-action-primary">
              <i className="material-icons">lightbulb_outline</i>
            </div>
            <div className="row-content">
              <div
                className="action-secondary"
                onClick={this.props.handleDeleteNoteClick.bind(this, note)}>
                <i className="material-icons">delete</i>
              </div>
              <div className="list-group-item-subheading">
                {moment(note.updated_at).fromNow()}
              </div>
              <h4 className="list-group-item-heading">
                {note.title}
              </h4>
            </div>
          </div>
          <div className="list-group-separator"></div>
        </div>
      );
    });

    return (
      <div className="list-group notes-list collapse in">
        {commentNodes}
      </div>
    );
  }

  getItemCssClass(note) {
    cssClass = "list-group-item note-navigation-item"
    if (note.uid === this.props.activeNoteUid) {
      cssClass += ' active';
    }

    return cssClass;
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

    if (this.state.searchQuery !== nextProps.searchQuery) {
      this.listNeedsUpdate = true;
    }

    this.setState( {
      isSynced: nextProps.isSynced,
      searchQuery: nextProps.searchQuery
    });
  }

  handleNoteClick(note, e) {
    $('.note-navigation-item').removeClass('active');
    $(e.currentTarget).addClass('active');

    this.props.handleNoteClick(note, e);
  }

  updateList() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: { search: this.state.searchQuery },
      success: (data) => {
        this.setState({ notes: data });
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
}
