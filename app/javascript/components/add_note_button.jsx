import React from 'react';

class AddNoteButton extends React.Component {
  render () {
    return (
      <a
        href="#"
        className="btn btn-info btn-fab btn-new-note"
        onClick={this.handleNewNoteClick.bind(this)}
      >
        <i className="material-icons">add</i>
      </a>
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
