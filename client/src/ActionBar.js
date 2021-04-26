import React, { Component } from 'react';
import SaveStateLabel from './SaveStateLabel';

import { ReactComponent as NewIcon } from './icons/material/add-24px.svg';

import './ActionBar.css';

export class ActionBar extends Component { 
  render() {
    return (
      <div className="action-bar">
        {this.props.left ? this.props.left : <div className="icon big invisible"></div>}

        <SaveStateLabel isSynced={this.props.isSynced} />

        <button name="new" onClick={this.props.handleNewClicked.bind(this)} className="icon big">
          <NewIcon />
        </button>
      </div>
    );
  }
}

export default ActionBar;
