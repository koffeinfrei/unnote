import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';
import Logo from './Logo';
import SearchBox from './SearchBox';
import { isFeatureEnabled } from './feature';

import { ReactComponent as CloseIcon } from './icons/material/close-24px.svg';

import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <nav>
        <Logo />

        {this.props.isLoggedIn && <SearchBox handleSearchEnter={this.props.handleSearchEnter} handleSearchCleared={this.props.handleSearchCleared} />}

        <input id="bmenug" type="checkbox" className="show" ref={c => this.showHamburger = c} />
        <label htmlFor="bmenug" className="burger pseudo button">&#8801;</label>

        <div className="menu">
          { isFeatureEnabled('tasks') &&
            <NavLink to="/notes" className="button pseudo">All notes</NavLink>
          }
          { isFeatureEnabled('tasks') &&
            <NavLink to="/task-notes" className="button pseudo">Task notes</NavLink>
          }
          { isFeatureEnabled('tasks') &&
            <NavLink to="/tasks" className="button pseudo">Tasks</NavLink>
          }

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

  handleCloseHamburgerClicked() {
    this.showHamburger.checked = false;
  }
}

export default Navbar;
