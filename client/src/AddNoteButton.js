import React, { Component } from 'react';
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

    this.props.handleNewNoteClick();
  }
}

export default AddNoteButton;
