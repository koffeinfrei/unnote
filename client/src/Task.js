import React, { Component } from 'react';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <label className="task">
        <input
          type="checkbox"
          checked={this.props.task.done}
          onChange={this.props.handleTaskChecked.bind(this, this.props.note, this.props.task.id)} />

        <span className="checkable">{this.props.task.title}</span>
      </label>
    );
  }
}

export default Task;
