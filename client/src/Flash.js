import React, { Component } from 'react';
import NoticeFlash from './NoticeFlash';
import AlertFlash from './AlertFlash';

class Flash extends Component {
  render() {
    return (
      <div>
        <NoticeFlash />
        <AlertFlash />
      </div>
    );
  }
}

export default Flash;
