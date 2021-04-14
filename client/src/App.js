import React, { Component, Suspense } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { ajax } from './ajax';
import NoteEdit from './NoteEdit';
import TaskEdit from './TaskEdit';
import './App.css';
import './fonts/roboto.css';

const LoginForm = React.lazy(() => import('./LoginForm'));
const RegistrationForm = React.lazy(() => import('./RegistrationForm'));

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: null
    };

    this.setIsLoggedIn();
  }

  render() {
    return (
      <Router>
        <div>
          { this.renderLoggedIn() }
          { this.renderLoggedOut() }
        </div>
      </Router>
    );
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  setIsLoggedIn() {
    ajax('/users/is_authenticated')
      .then(() => this.onLoginSuccess())
      .catch(() => this.setState({ isLoggedIn: false }));
  }

  renderLoggedIn() {
    if (this.state.isLoggedIn === true) {
      return (
        <Switch>
          <Route path={['/notes', '/notes/:id']} render={ (props) => this.renderNoteEdit(props, 'notes') } />
          <Route path={['/task-notes', '/task-notes/:id']} render={ (props) => this.renderNoteEdit(props, 'task_notes') } />
          <Route path={['/tasks', '/tasks/:id']} render={ (props) => <TaskEdit {...props} /> } />
          <Redirect from='/' to='/notes' />
        </Switch>
      );
    }
  }

  renderLoggedOut() {
    if (this.state.isLoggedIn === false) {
      return (
        <Switch>
          <Route path='/register' render={props => (
            <Suspense fallback={<div></div>}>
              <RegistrationForm onLoginSuccess={this.onLoginSuccess.bind(this)} {...props} />
            </Suspense>
          )}/>

          <Route path='/login' render={props => (
            <Suspense fallback={<div></div>}>
              <LoginForm onLoginSuccess={this.onLoginSuccess.bind(this)} alwaysRememberMe={window.ALWAYS_REMEMBER_ME} />
            </Suspense>
          )}/>

          <Redirect to='/login' />
        </Switch>
      );
    }
  }

  renderNoteEdit(routerProps, collection) {
    return (
      <NoteEdit
        {...routerProps}
        collection={collection} />
    );
  }
}

export default App;
