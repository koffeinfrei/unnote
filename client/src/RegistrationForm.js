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
          { this.renderIntro() }

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

  renderIntro() {
    return (
      <div className="jumbotron">
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
    });
  }
}

export default RegistrationForm;
