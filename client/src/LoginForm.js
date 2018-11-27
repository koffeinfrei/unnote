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
                <TextInput type="email" model="user" attribute="email" label="Email"
                  onChange={this.setValue.bind(this)} />

                <TextInput type="password" model="user" attribute="password" label="Password"
                  onChange={this.setValue.bind(this)} />

                <Checkbox model="user" attribute="remember_me" label="Remember me"
                  onChange={this.setValue.bind(this)} />
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

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    $.ajax({
      url: '/users/sign_in',
      method: 'POST',
      dataType: 'json',
      data: this.state
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
