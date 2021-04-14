import React, { Component } from 'react';
import ActionBar from './ActionBar';

import { ReactComponent as ShowListIcon } from './icons/material/arrow_back-24px.svg';

export class NoteActionBar extends Component { 
  render() {
    let showListButtonClassName = 'icon big invisible-lg';
    if (this.props.showList) {
      showListButtonClassName += ' invisible';
    }

    return (
      <ActionBar left={
        <button onClick={this.props.handleShowListClicked.bind(this)} className={showListButtonClassName}>
          <ShowListIcon />
        </button>
      }
      {...this.props} />
    );
  }
}

export default NoteActionBar;
