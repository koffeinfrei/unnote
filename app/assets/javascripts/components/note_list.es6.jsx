class NoteList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      notes: [],
      currentPage: 1,
      hasMorePages: false,
      isSynced: false,
      searchQuery: ''
    };
  }

  render() {
    var commentNodes = this.state.notes.map((note) => {
      return (
        <div key={note.uid}>
          <div
            className={this.getListItemCssClass(note)}
            onClick={this.handleNoteClick.bind(this, note)}>

            <div className="row-picture">
              {this.getNoteAvatar(note)}
            </div>
            <div className="row-content">
              <div
                className="action-secondary"
                onClick={this.props.handleDeleteNoteClick.bind(this, note)}>
                <i className="material-icons">delete</i>
              </div>
              <h4 className="list-group-item-heading">
                {note.title}
              </h4>
              <div className="list-group-item-text">
                {moment(note.updated_at).fromNow()}
              </div>
            </div>
          </div>
          <div className="list-group-separator"></div>
        </div>
      );
    });

    var nextPageLink = null;
    if (this.state.hasMorePages) {
      nextPageLink = (
        <div className="list-more list-more-next-page">
          <a href="#" onClick={this.handleNextPageClick.bind(this)}>
            <i className="material-icons list-more-icon">expand_more</i>
          </a>
        </div>
      );
    }

    var listSpinner = (
      <div className="list-more list-more-spinner hidden">
        <svg
          className="spinner"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            className="path"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="30"></circle>
        </svg>
      </div>
    );

    return (
      <div className={this.getListCssClass()}>
        {commentNodes}
        {nextPageLink}
        {listSpinner}
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

  handleNextPageClick(e) {
    e.preventDefault();
    $(e.currentTarget).blur();

    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.updateList();
    });
  }

  updateList() {
    this.toggleListMore(false);

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: { search: this.state.searchQuery, page: this.state.currentPage }
    })
    .done((data) => {
      this.toggleListMore(true);

      this.setState({
        notes: data.notes,
        currentPage: data.current_page,
        hasMorePages: data.has_more_pages
      });
    })
    .fail((xhr, status, error) => {
      this.toggleListMore(true);

      AlertFlash.show('Watch out, the list is not up to date.');
      console.error('url: ', this.props.url, 'status: ', status, 'error: ', error.toString());
    });
  }

  getPreviewImageUrl(note) {
    var match = note.content.match(/<img?.* src=['"]([^'"]+)['"]?.*>/);
    if (match) {
      return match[1];
    }
    else {
      return null;
    }
  }

  getNoteAvatar(note) {
    var previewImageUrl = this.getPreviewImageUrl(note);
    if (previewImageUrl) {
      return <img src={previewImageUrl} className="circle" />;
    }
    else {
      return <i className="material-icons">subject</i>;
    }
  }

  toggleListMore(linkIsVisible) {
    if (linkIsVisible) {
      $('.list-more-next-page').removeClass('hidden');
      $('.list-more-spinner').addClass('hidden');
    }
    else {
      $('.list-more-next-page').addClass('hidden');
      $('.list-more-spinner').removeClass('hidden');
    }
  }
}
