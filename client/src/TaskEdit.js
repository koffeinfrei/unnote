import React, { Component } from 'react';
import Navbar from './Navbar';
import ActionBar from './ActionBar';
import Flash from './Flash';
import AlertFlash from './AlertFlash';
import AutoSave from './AutoSave';
import Note from './Note';
import TaskGroup from './TaskGroup';
import SearchTerm from './SearchTerm';
import { ajax } from './ajax';

class TaskEdit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      notes: [],
      currentPage: 1,
      searchQuery: undefined,
      filter: 'todo'
    }
  }

  render() {
    return (
      <div>
        <Navbar
          isLoggedIn={true}
          handleSearchEnter={this.handleSearchEnter.bind(this)}
          handleSearchCleared={this.handleSearchCleared.bind(this)} />

        <main>
          <Flash />
          <ActionBar
            handleNewClicked={() => this.props.history.push('/notes')}
            isSynced={this.state.isSynced} />
          <div className="flex one">
            <div className="full">
              <SearchTerm searchQuery={this.state.searchQuery} />
              <div className="view-filter">
                <select onChange={this.handleFilterChanged.bind(this)}>
                  <option value="todo">Show todos</option>
                  <option value="">Show all</option>
                </select>
              </div>
              {this.state.notes.map((note) =>
                <TaskGroup
                  key={note.uid}
                  note={note}
                  handleTaskChecked={this.handleTaskChecked.bind(this)} />
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  componentDidMount() {
    this.autoSave = new AutoSave(this.handleServerSync.bind(this));
    this.autoSave.startPolling();

    this.fetchTasks();
  }

  componentWillUnmount() {
    this.autoSave.stopPolling();
  }

  handleTaskChecked(note, task_id, e) {
    // create a temporary html element so we can easily query the task element
    // and toggle the checked class
    const noteContentElement = document.createElement('div');
    noteContentElement.innerHTML = note.content;
    const taskElement = noteContentElement.querySelector(`[data-task-id="${task_id}"]`);
    taskElement.classList.toggle('checked');

    const syncNote = Note.fromAttributes(note);
    syncNote.content = noteContentElement.innerHTML;

    this.autoSave.setChange(syncNote);
  }

  handleServerSync(data) {
    this.fetchTasks();
    this.setState({ isSynced: data.isSynced });
  }

  handleSearchEnter(e) {
    this.setState({ searchQuery: e.target.value });
    this.fetchTasks();
  }

  handleSearchCleared() {
    this.setState({ searchQuery: '' });
    this.fetchTasks();
  }

  handleFilterChanged(e) {
    this.setState({ filter: e.target.value }, () => {
      this.fetchTasks();
    });
  }

  fetchTasks() {
    const params = {
      search: this.state.searchQuery,
      page: this.state.currentPage
    };

    if (this.state.filter) {
      params['filters[]'] = this.state.filter;
    }

    ajax('/api/task_notes', 'GET', params)
      .then((data) => {
        this.setState({ notes: data.notes });
      })
      .catch((error) => {
        AlertFlash.show('Fetching the tasks failed.');
        console.error('url: ', this.props.url, 'error: ', error.toString());
      });
  }
}

export default TaskEdit;
