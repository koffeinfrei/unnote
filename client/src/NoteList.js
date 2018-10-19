import React, { Component } from 'react';
import humanDate from 'human-date';
import $ from 'jquery';
import ViewportMode from './ViewportMode';
import EventHive from './EventHive';
import Note from './Note';
import AlertFlash from './AlertFlash';

class NoteList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      notes: [],
      currentPage: 1,
      hasMorePages: false,
      isSynced: false,
      searchQuery: undefined
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
                {humanDate.relativeTime(note.updatedAt)}
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
          <button onClick={this.handleNextPageClick.bind(this)} className="btn btn-info btn-link btn-sm">
            <i className="material-icons list-more-icon">expand_more</i>
          </button>
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
      <div className={this.getListCssClass()} ref={(c) => this.$list = $(c)}>
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

  componentDidMount() {
    this.toggleListMore(false);

    // handle hamburger and search toggling
    if (ViewportMode.isMobileMode()) {
      this.$list.collapse({ toggle: false });
      // when the hiding animation is done
      this.$list.on('hidden.bs.collapse', () => {
        EventHive.publish('hamburger.hide_end');
      });

      EventHive.subscribe('hamburger.show', () => {
        this.$list.collapse('show');
      });
      EventHive.subscribe('hamburger.hide', () => {
        this.$list.collapse('hide');
      });

      EventHive.subscribe('search.entered', () => {
        this.$list.collapse('show');
      });

      EventHive.subscribe('note.open', () => {
        this.$list.collapse('hide');
      });
    }
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
      this.setSearchProgress(true);
    }

    this.setState( {
      isSynced: nextProps.isSynced,
      searchQuery: nextProps.searchQuery
    });
  }

  handleNoteClick(note, e) {
    $('.note-navigation-item').removeClass('active');
    $(e.currentTarget).addClass('active');

    if (ViewportMode.isMobileMode()) {
      EventHive.publish('hamburger.hide');
    }

    EventHive.publish('note.open');
    this.props.handleNoteClick(note, e);
  }

  handleNextPageClick(e) {
    e.preventDefault();
    $(e.currentTarget).blur();

    this.toggleListMore(false);

    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.updateList();
    });
  }

  updateList() {
    if (this.updateListRequest) {
      this.updateListRequest.abort();
    }

    this.updateListRequest = $.ajax({
      url: '/api/notes',
      dataType: 'json',
      data: { search: this.state.searchQuery, page: this.state.currentPage }
    });

    this.updateListRequest
      .done((data) => {
        this.toggleListMore(true);

        const notes = data.notes.map(function(note) {
          return Note.fromAttributes(note);
        });

        this.setState({
          notes: notes,
          currentPage: data.current_page,
          hasMorePages: data.has_more_pages
        });
      })
      .fail((xhr, status, error) => {
        // it's not a failure when the request was aborted by a subsequent
        // request (see call to `abort()` above).
        if (error === 'abort') {
          return;
        }

        this.toggleListMore(true);

        AlertFlash.show('Watch out, the list is not up to date.');
        console.error('url: ', this.props.url, 'status: ', status, 'error: ', error.toString());
      })
      .always(() => {
        this.setSearchProgress(false);
      });
  }

  getPreviewImageUrl(note) {
    var match = note.content.match(/<img.*? src=['"]([^'"]+)['"].*?>/);
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
      return <img src={previewImageUrl} className="circle" alt="note thumbnail" />;
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

  setSearchProgress(isInProgress) {
    EventHive.publish('spinner.toggle', { show: isInProgress });
  }
}

export default NoteList;
