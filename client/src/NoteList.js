import React, { Component } from 'react';
import humanDate from 'human-date';
import $ from 'jquery';
import Note from './Note';
import AlertFlash from './AlertFlash';
import Spinner from './Spinner';

import defaultNotePicture from './icons/material/short_text-24px.svg';
import archiveIcon from './icons/material/archive-24px.svg';
import deleteIcon from './icons/material/delete-24px.svg';
import moreIcon from './icons/material/expand_more-24px.svg';

import './NoteList.css';

class NoteList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      notes: [],
      currentPage: 1,
      hasMorePages: false,
      isSynced: false,
      showMoreLink: false,
      searchQuery: undefined
    };
  }

  render() {
    return (
      <div className={this.getListCssClass()}>
        {this.renderList()}
        {this.renderNextPageLink()}
        {this.renderListSpinner()}
      </div>
    );
  }

  renderList() {
    if (this.state.searchQuery && this.state.notes.length === 0) {
      return this.renderEmptyListItem();
    }
    return this.state.notes.map((note) => this.renderListItem(note));
  }

  renderEmptyListItem() {
    return (
      <div className="list-group-item note-navigation-item not-clickable list-nothing">
        <div className="list-group-item-heading">
          There's nothing…
        </div>
      </div>
    );
  }

  renderListItem(note) {
    return (
      <div
        className={this.getListItemCssClass(note)}
        key={note.uid}
        onClick={this.handleNoteClick.bind(this, note)}>

        {this.renderNotePicture(note)}
        <div className="list-item-content">
          <h4 className="list-item-heading">
            {note.title}
          </h4>
          <div className="list-item-meta tooltip-top" data-tooltip={humanDate.prettyPrint(note.updatedAt, { showTime: true })}>
            {humanDate.relativeTime(note.updatedAt)}
          </div>
        </div>
        <div className="list-item-actions">
          {this.renderListItemButton('archive', archiveIcon, this.props.handleArchiveNoteClick.bind(this, note))}
          {this.renderListItemButton('delete', deleteIcon, this.props.handleDeleteNoteClick.bind(this, note))}
        </div>
      </div>
    );
  }

  renderListItemButton(action, icon, onClick, className) {
    const classNames = ['icon', className].filter(x => x).join(' ')

    return (
      <button className={classNames} onClick={onClick}>
        <img src={icon} alt={action} />
      </button>
    );
  }

  renderNextPageLink() {
    if (!this.state.hasMorePages) { return; }
    if (!this.state.showMoreLink) { return; }

    return (
      <div>
        {this.renderListItemButton('more', moreIcon, this.handleNextPageClick.bind(this), 'big list-more')}
      </div>
    );
  }

  renderListSpinner() {
    if (this.state.showMoreLink) { return; }

    return (
      <div className="icon big list-more">
        <Spinner />
      </div>
    );
  }

  getListItemCssClass(note) {
    let cssClass = 'card list-item';
    if (this.isActiveNote(note)) {
      cssClass += ' active';
    }

    return cssClass;
  }

  isActiveNote(note) {
    return note.uid === this.props.activeNoteUid;
  }

  getListCssClass() {
    if (!this.props.showList) {
      return 'hidden-sm';
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
    }

    this.setState( {
      isSynced: nextProps.isSynced,
      searchQuery: nextProps.searchQuery
    });
  }

  handleNoteClick(note, e) {
    this.props.handleNoteClick(note, e);
  }

  handleNextPageClick(e) {
    e.preventDefault();
    $(e.currentTarget).blur();

    this.setState({ showMoreLink: false });

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

    this.executeUpdateListRequest();
  }

  executeUpdateListRequest() {
    this.updateListRequest
      .done((data) => {
        this.setState({ showMoreLink: true });

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

        this.setState({ showMoreLink: true });

        AlertFlash.show('Watch out, the list is not up to date.');
        console.error('url: ', this.props.url, 'status: ', status, 'error: ', error.toString());
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

  renderNotePicture(note) {
    const url = this.getPreviewImageUrl(note) || defaultNotePicture;

    const style = {
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };

    return <div style={style} className="list-item-picture"></div>;
  }
}

export default NoteList;
