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
        {this.props.note.tasks.todo.length > 0 ?
          <footer>
            {this.props.note.tasks.todo.map(task => this.renderTask(task, false))}
          </footer>
          :
          null
        }
        {this.props.note.tasks.done.length > 0 ?
          <footer>
            <button className='icon left-aligned full-width' onClick={() => this.setState({ showDone: !this.state.showDone })}>
              { this.state.showDone ?
                <LessIcon /> :
                <MoreIcon />
              }
            </button>

            <div className={ this.state.showDone ? null : "collapsed"}>
              {this.props.note.tasks.done.map(task => this.renderTask(task, true))}
            </div>
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
