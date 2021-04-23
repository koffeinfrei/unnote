import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import EventHive from './EventHive';
import Logout from './Logout';
import Logo from './Logo';

import { ReactComponent as CloseIcon } from './icons/material/close-24px.svg';

import './Navbar.css';

class Navbar extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSearchEnterDebounced = debounce(500, this.handleSearchEnterDebounced);
  }

  render() {
    return (
      <nav>
        <Logo />

        {this.props.isLoggedIn ? this.renderSearchBox() : null}

        <input id="bmenug" type="checkbox" className="show" ref={c => this.showHamburger = c} />
        <label htmlFor="bmenug" className="burger pseudo button">&#8801;</label>

        <div className="menu">
          <NavLink to="/notes" className="button pseudo">All notes</NavLink>
          <NavLink to="/task-notes" className="button pseudo">Task notes</NavLink>
          <NavLink to="/tasks" className="button pseudo">Tasks</NavLink>

          <button
            className="icon close-hamburger hidden-lg"
            onClick={this.handleCloseHamburgerClicked.bind(this)}>
            <CloseIcon />
          </button>

          {this.props.isLoggedIn ? <Logout /> : null}
        </div>
      </nav>
    );
  }

  componentDidMount() {
    this.subscribeSearch();
  }

  componentWillUnmount() {
    this.unsubscribeSearch();
  }

  renderSearchBox() {
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

  handleSearchEnter(e) {
    e.persist();
    this.handleSearchEnterDebounced(e);
  }

  handleSearchEnterDebounced(e) {
    this.props.handleSearchEnter(e);
  }

  handleSearchCleared(e) {
    this.searchInput.value = '';
    e.target.blur();
    this.props.handleSearchCleared();
  }

  handleCloseHamburgerClicked() {
    this.showHamburger.checked = false;
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

export default Navbar;
