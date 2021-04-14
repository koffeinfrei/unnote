import React, { Component } from 'react';
import Task from './Task';

class TaskGroup extends Component {
  render() {
    return (
      <div className="card">
        <header>
          {this.props.note.title}
        </header>
        {this.props.note.tasks.todo.length > 0 ?
          <footer>
            {this.props.note.tasks.todo.map(task => this.renderTask(task, false))}
          </footer>
          :
          null
        }
        {this.props.note.tasks.done.length > 0 ?
          <footer>
            {this.props.note.tasks.done.map(task => this.renderTask(task, true))}
          </footer>
          :
          null
        }
      </div>
    );
  }

  renderTask(task, done) {
    const [ id, title ] = Object.entries(task)[0];

    return (
      <Task
        key={id}
        note={this.props.note}
        id={id}
        title={title}
        done={done}
        handleTaskChecked={this.props.handleTaskChecked.bind(this)} />
    );
  }
}

export default TaskGroup;
