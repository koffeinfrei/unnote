import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import { TextInput, SubmitButton, Checkbox, Utf8 } from './Form';

class LoginForm extends Component {
  render() {
    return (
      <form onSubmit={this.handleFormSubmit.bind(this)}>
        <Utf8 />

        <div className="form-inputs">
          <TextInput type="email" model="user" attribute="email" label="Email" />
          <TextInput type="password" model="user" attribute="password" label="Password" />
          <Checkbox model="user" attribute="remember_me" label="Remember me" />
        </div>

        <div className="form-actions">
          <SubmitButton label="Log in" />
        </div>
      </form>
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const url = '/users/sign_in';
    const data = $(e.target).serialize();

    $.ajax({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: data
    })
    .done((data) => {
      AlertFlash.clear();
      this.props.onLoginSuccess();
    })
    .fail(() => {
      AlertFlash.show('Sorry, that did not work. ' +
                      'Did you enter a wrong username or a wrong password?')
    });
  }
}

export default LoginForm;
