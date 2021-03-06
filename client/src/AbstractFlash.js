import React, { Component } from 'react';
import $ from 'jquery';

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
    $(document).on(this.constructor.getEventName(), (e, data) => {
      this.setState({ message: data.message });
    });
  }

  componentWillUnmount() {
    $(document).off(this.constructor.getEventName());
  }

  getAdditionalCssClass() {
  }

  getName() {
  }

  static getEventName() {
    return 'mykonote.flash.' + this.prototype.getName();
  }

  static show(message) {
    $(document).trigger(this.getEventName(), { message: message });
  }

  static clear() {
    $(document).trigger(this.getEventName(), { message: null });
  }
}

export default AbstractFlash;
