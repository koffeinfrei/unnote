import React, { Component } from 'react';
import $ from 'jquery';
import EventHive from './EventHive';
import ViewportMode from './ViewportMode';
import Spinner from './Spinner';
import logo from './images/logo.svg';

class Navbar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { showSpinner: false };
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="navbar-header">
            {this.renderLogo()}
            {this.renderMobileHamburgerMenu()}
            {this.renderMobileSearchButton()}
          </div>
          {this.renderSearchBox()}
        </div>
      </div>
    );
  }

  renderLogo() {
    return (
      <div className="navbar-brand">
        <div className="navbar-spinner">
          {this.state.showSpinner ? (
            <Spinner />
          ) : (
            <div className="navbar-logo">
              <img src={logo} alt="logo" />
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.subscribeSpinner();
    this.subscribeSearch();
    this.subscribeMobileSearch();
  }

  componentWillUnmount() {
    this.$searchBox.off('shown.bs.collapse');
  }

  renderSearchBox() {
    return (
      <div
        className="navbar-form navbar-right search-bar collapse in-sm"
        ref={(c) => this.$searchBox = $(c)}>
        <input
          type="text"
          className="string optional form-control search-input"
          placeholder="Search"
          onChange={this.props.handleSearchEnter}
          ref={(c) => this.$searchInput = $(c)} />
        <button
          type="button"
          className="close clear-search"
          onClick={this.handleSearchCleared.bind(this)}>×</button>
      </div>
    );
  }

  renderMobileHamburgerMenu() {
    return (
      <button
        className="navbar-toggle navbar-hamburger-button"
        type="button"
        onClick={this.handleHamburgerButtonClick}>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    );
  }

  renderMobileSearchButton() {
    return (
      <button
        className="navbar-toggle navbar-search-button" type="button"
        onClick={this.handleSearchButtonClick.bind(this)}
        ref={(c) => this.$searchButton = $(c)}>
        <i className="material-icons">search</i>
      </button>
    );
  }

  getSpinnerCssClass() {
    let cssClass = 'spinner';
    if (!this.state.showSpinner) {
      cssClass += ' hidden';
    }

    return cssClass;
  }

  getLogoCssClass() {
    let cssClass = 'navbar-logo';
    if (this.state.showSpinner) {
      cssClass += ' hidden';
    }

    return cssClass;
  }

  handleSearchButtonClick() {
    if (!ViewportMode.isMobileMode()) {
      return;
    }

    if (this.$searchButton.hasClass('is-expanded')) {
      this.$searchButton.removeClass('is-expanded');
      EventHive.publish('search.hide');
    }
    else {
      this.$searchButton.addClass('is-expanded');
      EventHive.publish('search.show');
    }
  }

  handleHamburgerButtonClick(e) {
    if (!ViewportMode.isMobileMode()) {
      return;
    }

    const $hamburger = $(e.target);
    if ($hamburger.hasClass('is-expanded')) {
      $hamburger.removeClass('is-expanded');
      EventHive.publish('hamburger.hide');
    }
    else {
      $hamburger.addClass('is-expanded');
      EventHive.publish('hamburger.show');
    }
  }

  handleSearchCleared(e) {
    this.$searchInput.val('');
    $(e.target).blur();
    this.props.handleSearchCleared();
  }

  subscribeSpinner() {
    // listen on global event so we can toggle the spinner from unrelated
    // components
    EventHive.subscribe('spinner.toggle', (data) => {
      this.setState({ showSpinner: data.show });
    });
  }

  subscribeSearch() {
    EventHive.subscribe('search.focus', () => {
      this.$searchInput.focus();
      this.$searchInput.select();
    });
  }

  subscribeMobileSearch() {
    // handle hamburger and search toggling
    if (ViewportMode.isMobileMode()) {
      EventHive.subscribe('search.hide', () => {
        this.$searchButton.removeClass('is-expanded');
      });

      this.$searchBox.collapse({ toggle: false });
      // when the hiding animation is done
      this.$searchBox.on('hidden.bs.collapse', () => {
        EventHive.publish('search.hide_end');
      });

      EventHive.subscribe('search.show', () => {
        this.$searchBox.collapse('show');
      });
      EventHive.subscribe('search.hide', () => {
        this.$searchBox.collapse('hide');
      });

      EventHive.subscribe('note.open', () => {
        if (this.$searchInput.val() === '') {
          EventHive.publish('search.hide');
        }
      });

      // event when search box is fully toggled (see bootstrap collapse)
      this.$searchBox.on('shown.bs.collapse', () => {
        this.$searchInput.focus();
      });
    }
  }
}

export default Navbar;
