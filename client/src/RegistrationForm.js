import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import NoticeFlash from './NoticeFlash';
import { TextInput, SubmitButton, Utf8 } from './Form';
import { scrollToTop } from './scroll';
import Navbar from './Navbar';
import Flash from './Flash';
import UserForm from './UserForm';

class RegistrationForm extends Component {
  render() {
    return (
      <div>
        <Navbar isLoggedIn={false} />
        <main>
          <Flash />
          <UserForm intro={this.renderIntro()}>
            <form onSubmit={this.handleFormSubmit.bind(this)}>
              <Utf8 />

              <div className="flex one">
                {this.renderTextInput("email", "email", "Email")}

                {this.renderTextInput("password", "password", "Password")}

                {this.renderTextInput("password", "password_confirmation", "Confirm password")}
              </div>

              <SubmitButton label="Register" />
            </form>
          </UserForm>
        </main>
      </div>
    );
  }

  renderIntro() {
    return (
      <div>
        <p>
          You can register for a <strong>free account</strong> which <strong>limits</strong> you to <strong>100 notes</strong>.
          <br/>
          This free hosting service is sponsored by <a href="https://www.panter.ch">Panter AG</a>.
        </p>
        <p>
          Alternatively you may <a href="https://github.com/panter/mykonote">get the source code from
          GitHub</a> and install it on a server on your own.
        </p>
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

    $.ajax({
      url: '/users',
      method: 'POST',
      dataType: 'json',
      data: this.state
    })
    .done((data) => {
      AlertFlash.clear();
      this.props.onLoginSuccess();
      this.props.history.push('/notes')
      NoticeFlash.show(
        'Great! Glad you made it!<br>' +
          'You have been subscribed to the <strong>free plan</strong> which ' +
          '<strong>limits</strong> you to have <strong>100 notes</strong>.'
      )
    })
    .fail(({ responseJSON }) => {
      const errors = responseJSON.errors.join('<br>');

      AlertFlash.show('Sorry, that did not work. You need to fix your inputs:<br>' + errors)
    })
    .always(scrollToTop);
  }
}

export default RegistrationForm;
