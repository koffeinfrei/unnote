import React, { Component } from 'react';

class AbstractFlash extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { message: props.message };
  }

  render () {
    if (!this.state.message) {
      return null;
    }

    return (
      <div className="flex center">
        <div className="hidden-sm"></div>

        <div className='full third-1000'>
          <div className={this.getCssClass()}>
            <footer dangerouslySetInnerHTML={{ __html: this.state.message }} />
            <button className="close icon" type="button" onClick={this.handleClose.bind(this)}>×</button>
          </div>
        </div>

        <div className="hidden-sm"></div>
      </div>
    );
  }

  getCssClass() {
    var cssClasses = ['card', this.getAdditionalCssClass()];

    return cssClasses.join(' ');
  }

  handleClose() {
    this.setState({ message: null });
  }

  componentDidMount() {
    // listen on global event so we can use `NoticeFlash.show('hello')`
    document.addEventListener(this.constructor.getEventName(), this.handleEvent.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener(this.constructor.getEventName(), this.handleEvent.bind(this), false);
  }

  handleEvent(e) {
    this.setState({ message: e.detail.message });
  }

  getAdditionalCssClass() {
  }

  getName() {
  }

  static getEventName() {
    return 'mykonote.flash.' + this.prototype.getName();
  }

  static show(message) {
    const e = new CustomEvent(this.getEventName(), { detail: { message: message } });
    document.dispatchEvent(e);
  }

  static clear() {
    const e = new CustomEvent(this.getEventName(), { detail: { message: null } });
    document.dispatchEvent(e);
  }
}

export default AbstractFlash;
