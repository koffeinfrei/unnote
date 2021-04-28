import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';
import EventHive from './EventHive';

import { ReactComponent as SearchIcon } from './icons/material/search_black_24dp.svg';

import './SearchBox.css';

class SearchBox extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      isActive: false
    }

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <div className="search vertically-aligned">
        <input
          type="text"
          className="search-input"
          name="search"
          value={this.state.value}
          onChange={this.handleSearchEnter.bind(this)}
          onFocus={() => this.setState({ isActive: true })}
          onBlur={() => this.setState({ isActive: false })}
          ref={(c) => this.searchInput = c} />
        {this.state.value !== '' &&
          <button
            type="button"
            className="search-clear"
            onClick={this.handleSearchCleared.bind(this)}>×</button>
        }
        {!this.state.isActive && this.state.value === '' &&
          <SearchIcon onClick={() => this.searchInput.focus()} className="search-icon" />
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
