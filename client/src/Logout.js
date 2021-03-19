import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ajax } from './ajax';
import AlertFlash from './AlertFlash';
import { scrollToTop } from './scroll';

import { ReactComponent as LogoutIcon } from './icons/material/logout-24px.svg';

class Logout extends Component {
  render() {
    return (
      <button name="logout" onClick={this.handleClicked.bind(this)} className="icon-lg big pseudo">
        <LogoutIcon />
        <span className="icon-lg-text">Logout</span>
      </button>
    );
  }

  handleClicked(e) {
    e.preventDefault();

    ajax('/users/sign_out', 'DELETE')
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        AlertFlash.show('Apologies, logging out did not happen.')
      })
      .finally(scrollToTop);
  }
}

export default withRouter(Logout);
