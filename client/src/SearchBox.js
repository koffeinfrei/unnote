import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';
import EventHive from './EventHive';

import './SearchBox.css';

class SearchBox extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { value: '' }

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div className="search vertically-aligned">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={this.state.value}
          onChange={this.handleSearchEnter.bind(this)} />
        {this.state.value !== '' &&
          <button
            type="button"
            className="search-clear"
            onClick={this.handleSearchCleared.bind(this)}>×</button>
        }
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
    const value = e.target.value;
    this.setState({ value: value }, this.handleSearchEnterDebounced);
  }

  handleSearchEnterDebounced() {
    this.props.handleSearchEnter(this.state.value);
  }

  handleSearchCleared(e) {
    e.target.blur();
    this.setState({ value: '' });
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
