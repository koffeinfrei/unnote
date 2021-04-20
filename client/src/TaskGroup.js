import React, { Component } from 'react';
import Task from './Task';

import { ReactComponent as MoreIcon } from './icons/material/expand_more-24px.svg';
import { ReactComponent as LessIcon } from './icons/material/expand_less_black_24dp.svg';

class TaskGroup extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDone: false
    }
  }

  render() {
    return (
      <div className="card">
        <header>
          {this.props.note.title}
        </header>
        {this.renderTodo()}
        {this.renderDone()}
      </div>
    );
  }

  renderTodo() {
    const todo = this.props.note.tasks.filter(task => !task.done);

    return (
      <div>
        {todo.length > 0 ?
          <footer>
            {todo.map(task => this.renderTask(task))}
          </footer>
          :
          null
        }
      </div>
    );
  }

  renderDone() {
    const done = this.props.note.tasks.filter(task => task.done);

    return (
      <div>
        {done.length > 0 ?
          <footer>
            <button className='icon left-aligned full-width' onClick={() => this.setState({ showDone: !this.state.showDone })}>
              { this.state.showDone ?
                <LessIcon /> :
                <MoreIcon />
              }
            </button>

            <div className={ this.state.showDone ? null : "collapsed"}>
              {done.map(task => this.renderTask(task))}
            </div>
          </footer>
          :
          null
        }
      </div>
    );
  }

  renderTask(task) {
    return (
      <Task
        key={task.id}
        note={this.props.note}
        task={task}
        handleTaskChecked={this.props.handleTaskChecked.bind(this)} />
    );
  }
}

export default TaskGroup;
