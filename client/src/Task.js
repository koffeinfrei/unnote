import React, { Component } from 'react';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <label className="task">
        <input
          type="checkbox"
          checked={this.props.task.done}
          onChange={this.handleTaskChecked.bind(this, this.props.note, this.props.task)} />

        <span className="checkable">{this.props.task.title}</span>
      </label>
    );
  }

  handleTaskChecked(e) {
    this.props.handleTaskChecked(
      this.props.note,
      { ...this.props.task, done: !this.props.task.done },
      e
    );
  }
}

export default Task;
