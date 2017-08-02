class LoginForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    // use an event so we can overwrite this in the mobile application
    $(document).on('mykonote.afterLogin', (e, data) => {
      location.href = data.data.location;
    });
  }

  render() {
    return (
      <form className="simple_form new_user" onSubmit={this.handleFormSubmit}>
        <input type="hidden" value="✓" name="utf8" />

        <div className="form-inputs">
          <div className="form-group email optional user_email is-empty">
            <label
              htmlFor="user_email"
              className="email optional control-label">Email</label>
            <input
              type="email"
              id="user_email"
              name="user[email]"
              autoFocus="autofocus"
              className="string email optional form-control" />
          </div>

          <div className="form-group password optional user_password is-empty">
            <label
              htmlFor="user_password"
              className="password optional control-label">Password</label>
            <input
              type="password"
              id="user_password"
              name="user[password]"
              className="password optional form-control" />
          </div>

          <div className="form-group boolean optional user_remember_me">
            <div className="checkbox">
              <label htmlFor="user_remember_me" className="boolean optional">
                <input
                  type="checkbox"
                  id="user_remember_me"
                  name="user[remember_me]"
                  value="1"
                  className="boolean optional" />Remember me</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <input
            type="submit"
            className="btn btn-raised btn-primary btn-info"
            value="Log in"
            name="commit" />
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
      $(document).trigger('mykonote.afterLogin', { data: data });
    })
    .fail(() => {
      AlertFlash.show('Your login was totally not successful. ' +
                      'Did you enter a wrong username or a wrong password?')
    });
  }
}
