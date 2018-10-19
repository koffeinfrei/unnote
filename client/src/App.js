import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import $ from 'jquery';
import './global-jquery'; // bootstrap-material-design needs global jQuery
import 'bootstrap-material-design/dist/js/material';
import 'bootstrap-sass/assets/javascripts/bootstrap/modal';
import Flash from './Flash';
import LoginForm from './LoginForm';
import NoteEdit from './NoteEdit';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: undefined
    }
  }

  render() {
    return (
      <HashRouter>
        <div className="container-fluid">
          <Flash />
          { this.renderLoggedIn() }
          { this.renderLoggedOut() }
        </div>
      </HashRouter>
    );
  }

  componentDidMount() {
    $.material.init();
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  isLoggedIn() {
    if (this.state.isLoggedIn !== undefined) { return this.state.isLoggedIn; }

    $.ajax({
      url: '/users/is_authenticated',
      method: 'GET',
      dataType: 'json',
    })
    .done((data, status, xhr) =>{
      this.onLoginSuccess();
    })
    .fail(() => {
      this.setState({ isLoggedIn: false });
    });
  }

  renderLoggedIn() {
    if (this.isLoggedIn() === true) {
      return (
        <Switch>
          <Route path='/notes/:id' component={ NoteEdit } />
          <Route path='/notes' component={ NoteEdit } />
          <Redirect from='/' to='/notes' />
        </Switch>
      );
    }
  }

  renderLoggedOut() {
    if (this.isLoggedIn() === false) {
      return (
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="well">
              <LoginForm onLoginSuccess={this.onLoginSuccess.bind(this)} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
