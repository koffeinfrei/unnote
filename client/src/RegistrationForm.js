import React, { Component } from 'react';
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import NoticeFlash from './NoticeFlash';
import { TextInput, SubmitButton, Utf8 } from './Form';
import UserLinks from './UserLinks';

class RegistrationForm extends Component {
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
                <TextInput type="password" model="user" attribute="password_confirmation" label="Confirm password" />
              </div>

              <div className="form-actions">
                <SubmitButton label="Register" />
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

    const url = '/users';
    const data = $(e.target).serialize();

    $.ajax({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: data
    })
    .done((data) => {
      AlertFlash.clear();
      NoticeFlash.show('Great! Glad you made it!')
      this.props.onLoginSuccess();
      this.props.history.push('/notes')
    })
    .fail(({ responseJSON }) => {
      const errors = responseJSON.errors.join('<br>');

      AlertFlash.show('Sorry, that did not work. You need to fix your inputs:<br>' + errors)
    });
  }
}

export default RegistrationForm;
