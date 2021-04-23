import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import EventHive from './EventHive';
import { ReactComponent as LogoImage } from './images/logo.svg';

class Logo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { showSpinner: false };
  }
  render() {
    return (
      <Link to='/' className="brand">
        {this.state.showSpinner ? (
          <div className="logo">
            <Spinner />
          </div>
        ) : (
          <LogoImage className="logo" />
        )}
      </Link>
    );
  }

  componentDidMount() {
    this.subscribeSpinner();
  }

  componentWillUnmount() {
    this.unsubscribeSpinner();
  }

  subscribeSpinner() {
    // listen on global event so we can toggle the spinner from unrelated
    // components
    this.spinnerSubscription = EventHive.subscribe('spinner.toggle', (data) => {
      this.setState({ showSpinner: data.show });
    });
  }

  unsubscribeSpinner() {
    this.spinnerSubscription.remove();
  }
}

export default Logo;
