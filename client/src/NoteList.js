import React, { Component } from 'react';
import humanDate from 'human-date';
import { ajaxWithAbort } from './ajax';
import Note from './Note';
import AlertFlash from './AlertFlash';
import SearchTerm from './SearchTerm';
import LoadMoreButton from './LoadMoreButton';

import defaultNotePicture from './icons/material/short_text-24px.svg';
import { ReactComponent as ArchiveIcon } from './icons/material/archive-24px.svg';
import { ReactComponent as DeleteIcon } from './icons/material/delete-24px.svg';

import './NoteList.css';

class NoteList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      notes: [],
      currentPage: 1,
      hasMorePages: false,
      isLoadingMorePages: true,
      isSynced: false,
      searchQuery: undefined
    };
  }

  render() {
    return (
      <div className={this.getListCssClass()}>
        <SearchTerm searchQuery={this.state.searchQuery} />
        {this.renderTaskNotesFilters()}
        {this.renderList()}
        <LoadMoreButton
          showLoadMoreButton={this.state.hasMorePages}
          showSpinner={this.state.isLoadingMorePages}
          handleLoadMoreClick={this.handleLoadMoreClick.bind(this)} />
      </div>
    );
  }

  renderTaskNotesFilters() {
    if (this.props.collection !== 'task_notes') { return; }

    return (
      <div className="view-filter">
        <select onChange={this.handleTaskNoteFilterChanged.bind(this)}>
          <option value="">Show all</option>
          <option value="todo">Show todos</option>
        </select>
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
      <div>There's nothing…</div>
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
          <button name="archive-note" className='icon' onClick={this.props.handleArchiveNoteClick.bind(this, note)}>
            <ArchiveIcon />
          </button>
          <button name="delete-note" className='icon' onClick={this.props.handleDeleteNoteClick.bind(this, note)}>
            <DeleteIcon />
          </button>
        </div>
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
    if (!this.state.isSynced && nextProps.isSynced && nextProps.listNeedsUpdate !== false) {
      this.listNeedsUpdate = true;
    }

    if (this.state.searchQuery !== nextProps.searchQuery) {
      this.listNeedsUpdate = true;
    }

    // collection changed
    if (this.props.collection !== nextProps.collection) {
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

  handleLoadMoreClick(e) {
    this.setState({ isLoadingMorePages: true });

    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.updateList();
    });
  }

  handleTaskNoteFilterChanged(e) {
    this.setState({ filter: e.target.value }, () => {
      this.updateList();
    });
  }

  updateList() {
    if (this.updateListRequest) {
      this.updateListRequest.controller.abort();
    }

    const params = {
      search: this.state.searchQuery,
      page: this.state.currentPage
    };

    if (this.state.filter) {
      params['filters[]'] = this.state.filter;
    }

    this.updateListRequest = ajaxWithAbort(`/api/${this.props.collection}`, 'GET', params);

    this.executeUpdateListRequest();
  }

  executeUpdateListRequest() {
    this.updateListRequest.promise
      .then((data) => {
        const notes = data.notes.map(function(note) {
          return Note.fromAttributes(note);
        });

        this.setState({
          notes: notes,
          currentPage: data.current_page,
          hasMorePages: data.has_more_pages,
          isLoadingMorePages: false
        });
      })
      .catch((error) => {
        this.setState({ isLoadingMorePages: false });

        AlertFlash.show('Watch out, the list is not up to date.');
        console.error('url: ', this.props.url, 'error: ', error.toString());
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
