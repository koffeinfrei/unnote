import React, { Component } from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import AlertFlash from './AlertFlash';
import { scrollToTop } from './scroll';

import logoutIcon from './icons/material/logout-24px.svg';

class Logout extends Component {
  render() {
    return (
      <button onClick={this.handleClicked.bind(this)} className="icon-lg big pseudo">
        <img src={logoutIcon} alt="Logout" />
        <span className="icon-lg-text">Logout</span>
      </button>
    );
  }

  handleClicked(e) {
    e.preventDefault();

    $.ajax({
      url: '/users/sign_out',
      method: 'DELETE'
    })
    .done((data) => {
      window.location.reload();
    })
    .fail(() => {
      AlertFlash.show('Apologies, logging out did not happen.')
    })
    .always(scrollToTop);
  }
}

export default withRouter(Logout);
