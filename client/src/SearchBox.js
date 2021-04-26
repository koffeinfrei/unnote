import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';
import EventHive from './EventHive';

import './SearchBox.css';

class SearchBox extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div className="search vertically-aligned">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          onChange={this.handleSearchEnter.bind(this)}
          ref={(c) => this.searchInput = c} />
        <button
          type="button"
          className="search-clear"
          onClick={this.handleSearchCleared.bind(this)}>×</button>
      </div>
    );
  }

  componentDidMount() {
    this.subscribeSearch();
  }

  componentWillUnmount() {
    this.unsubscribeSearch();
  }

  handleSearchEnter(e) {
    e.persist();
    this.handleSearchEnterDebounced(e);
  }

  handleSearchEnterDebounced(e) {
    this.props.handleSearchEnter(e.target.value);
  }

  handleSearchCleared(e) {
    this.searchInput.value = '';
    e.target.blur();
    this.props.handleSearchCleared();
  }

  subscribeSearch() {
    this.searchSubscription = EventHive.subscribe('search.focus', () => {
      this.searchInput.focus();
    });
  }

  unsubscribeSearch() {
    this.searchSubscription.remove();
  }
}

export default SearchBox;
