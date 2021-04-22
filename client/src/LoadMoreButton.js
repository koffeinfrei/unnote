import React, { Component } from 'react';
import Spinner from './Spinner';
import { ReactComponent as MoreIcon } from './icons/material/expand_more-24px.svg';

class LoadMoreButton extends Component {
  render() {
    return (
      <div>
        {this.renderLoadMoreButton()}
        {this.renderSpinner()}
      </div>
    );
  }

  renderLoadMoreButton() {
    if (!this.props.showLoadMoreButton) { return null; }
    if (this.props.showSpinner) { return null; }

    return (
      <button className='icon big full-width' onClick={this.handleLoadMoreClick.bind(this)}>
        <MoreIcon />
      </button>
    );
  }

  renderSpinner() {
    if (!this.props.showSpinner) { return null; }

    return (
      <div className="icon big full-width">
        <Spinner />
      </div>
    );
  }

  handleLoadMoreClick(e) {
    e.preventDefault();
    e.currentTarget.blur();

    this.props.handleLoadMoreClick(e);
  }
}

export default LoadMoreButton;
