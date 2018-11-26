import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import { TextInput, SubmitButton, Checkbox, Utf8 } from './Form';
import UserLinks from './UserLinks';
import { scrollToTop } from './scroll';

class LoginForm extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="well">
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

            <UserLinks />
          </div>
        </div>
      </div>
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
    })
    .always(scrollToTop);
  }
}

export default LoginForm;
