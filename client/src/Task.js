import React, { Component } from 'react';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <label className="task">
        <input
          type="checkbox"
          checked={this.props.done}
          onChange={this.props.handleTaskChecked.bind(this, this.props.note, this.props.id)} />

        <span className="checkable">{this.props.title}</span>
      </label>
    );
  }
}

export default Task;
