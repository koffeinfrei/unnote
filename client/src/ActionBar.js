import React, { Component } from 'react';
import SaveStateLabel from './SaveStateLabel';

import { ReactComponent as ShowListIcon } from './icons/material/arrow_back-24px.svg';
import { ReactComponent as NewIcon } from './icons/material/add-24px.svg';

import './ActionBar.css';

export class ActionBar extends Component { 
  render() {
    let showListButtonClassName = 'icon big invisible-lg';
    if (this.props.showList) {
      showListButtonClassName += ' invisible';
    }

    return (
      <div className="action-bar">
        <button onClick={this.props.handleShowListClicked.bind(this)} className={showListButtonClassName}>
          <ShowListIcon />
        </button>

        <SaveStateLabel isSynced={this.props.isSynced} />

        <button onClick={this.props.handleNewNoteClicked.bind(this)} className="icon big">
          <NewIcon />
        </button>
      </div>
    );
  }
}

export default ActionBar;
