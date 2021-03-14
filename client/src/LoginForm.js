import React, { Component } from 'react';
import { ajax } from './ajax';
import AlertFlash from './AlertFlash';
import { TextInput, SubmitButton, Checkbox, Utf8, nameValue } from './Form';
import { scrollToTop } from './scroll';
import Navbar from './Navbar';
import Flash from './Flash';
import UserForm from './UserForm';

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      [nameValue({ model: 'user', attribute: 'remember_me' })]: props.alwaysRememberMe
    };
  }

  render() {
    return (
      <div>
        <Navbar isLoggedIn={false} />
        <main>
          <Flash />
          <UserForm>
            <form onSubmit={this.handleFormSubmit.bind(this)}>
              <Utf8 />

              <div className="flex one">
                {this.renderTextInput("email", "email", "Email")}

                {this.renderTextInput("password", "password", "Password")}

                {this.props.alwaysRememberMe ? (
                  null
                ) : (
                  <Checkbox model="user" attribute="remember_me" label="Remember me"
                    onChange={this.setValue.bind(this)} />
                )}
              </div>

              <SubmitButton label="Log in" />
            </form>
          </UserForm>
        </main>
      </div>
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

    ajax('/users/sign_in', 'POST', { ...this.state })
      .then((data) => {
        AlertFlash.clear();
        this.props.onLoginSuccess();
      })
      .catch(() => {
        AlertFlash.show('Sorry, that did not work. ' +
                        'Did you enter a wrong username or a wrong password?')
      })
      .finally(scrollToTop);
  }
}

export default LoginForm;
