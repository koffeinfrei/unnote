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
            className={this.getListItemCssClass(note)}
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
      <div className={this.getListCssClass()}>
        {commentNodes}
      </div>
    );
  }

  getListItemCssClass(note) {
    let cssClass = 'list-group-item note-navigation-item';
    if (note.uid === this.props.activeNoteUid) {
      cssClass += ' active';
    }

    return cssClass;
  }

  getListCssClass() {
    // in-sm: show always for non-mobile view
    let cssClass = 'list-group notes-list collapse in-sm';
    // show on mobile when not accessing a direct edit url
    if (!this.props.isInitialEdit) {
      cssClass += ' in';
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

    // FIXME: find a proper way to check for mobile mode
    let hamburgerMenu = $('.navbar-hamburger-button');
    if (hamburgerMenu.is(':visible')) {
      hamburgerMenu.click();
    }

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
