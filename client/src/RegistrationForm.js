import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import NoticeFlash from './NoticeFlash';
import { TextInput, SubmitButton, Utf8 } from './Form';
import { scrollToTop } from './scroll';
import UserForm from './UserForm';

class RegistrationForm extends Component {
  render() {
    return (
      <UserForm intro={this.renderIntro()}>
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <Utf8 />

          <div className="form-inputs">
            <TextInput type="email" model="user" attribute="email" label="Email"
              onChange={this.setValue.bind(this)} />

            <TextInput type="password" model="user" attribute="password" label="Password"
              onChange={this.setValue.bind(this)} />

            <TextInput type="password" model="user" attribute="password_confirmation" label="Confirm password"
              onChange={this.setValue.bind(this)} />
          </div>

          <div className="form-actions">
            <SubmitButton label="Register" />
          </div>
        </form>
      </UserForm>
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
      NoticeFlash.show(
        'Great! Glad you made it!<br>' +
          'You have been subscribed to the <strong>free plan</strong> which ' +
          '<strong>limits</strong> you to have <strong>100 notes</strong>.'
      )
      this.props.onLoginSuccess();
      this.props.history.push('/notes')
    })
    .fail(({ responseJSON }) => {
      const errors = responseJSON.errors.join('<br>');

      AlertFlash.show('Sorry, that did not work. You need to fix your inputs:<br>' + errors)
    })
    .always(scrollToTop);
  }
}

export default RegistrationForm;
