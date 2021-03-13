import React, { Component } from 'react';
import './SaveStateLabel.css';

class SaveStateLabel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { isSynced: props.isSynced };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isSynced: nextProps.isSynced });
  }

  render () {
    return (
      this.state.isSynced
        ?
        <div className="save-state saved">Saved</div>
        :
        <div className="save-state saving">Saving</div>
    );
  }
}

export default SaveStateLabel;
