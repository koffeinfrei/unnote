import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import { TextInput, SubmitButton, Checkbox, Utf8 } from './Form';
import { scrollToTop } from './scroll';
import UserForm from './UserForm';

class LoginForm extends Component {
  render() {
    return (
      <UserForm>
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <Utf8 />

          <div className="form-inputs">
            {this.renderTextInput("email", "email", "Email")}

            {this.renderTextInput("password", "password", "Password")}

            <Checkbox model="user" attribute="remember_me" label="Remember me"
              onChange={this.setValue.bind(this)} />
          </div>

          <div className="form-actions">
            <SubmitButton label="Log in" />
          </div>
        </form>
      </UserForm>
    );
  }

  renderTextInput(type, attribute, label) {
    return (
      <TextInput
        type={type}
        model="user"
        attribute={attribute}
        label={label}
        onChange={this.setValue.bind(this)} />
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
