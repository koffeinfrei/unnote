import React, { Component } from 'react';
import ViewportMode from './ViewportMode';
import EventHive from './EventHive';

class AddNoteButton extends Component {
  render () {
    return (
      <button
        className="btn btn-info btn-fab btn-new-note"
        onClick={this.handleNewNoteClick.bind(this)}
      >
        <i className="material-icons">add</i>
      </button>
    );
  }

  handleNewNoteClick(e) {
    e.preventDefault();

    if (ViewportMode.isMobileMode()) {
      EventHive.publish('hamburger.hide');
    }

    this.props.handleNewNoteClick();
  }
}

export default AddNoteButton;
