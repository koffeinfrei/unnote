import React, { Component } from 'react';
import Mousetrap from 'mousetrap'

class Dialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { show: !!props.show }
  }

  render() {
    const id = Math.random().toString(16).slice(-12);

    return (
      <div className="modal">
        <input id={id} type="checkbox" checked={this.state.show} onChange={() => {}} />
        <label htmlFor={id} className="overlay"></label>
        <article>
          <header>
            <h3>{this.props.title}</h3>
            <label htmlFor={id} className="close" onClick={this.handleCancelButtonClick.bind(this)}>&times;</label>
          </header>
          <section className="content" dangerouslySetInnerHTML={{ __html: this.props.text}}>
          </section>
          <footer>
            <button className="button" onClick={this.handleOkButtonClick.bind(this)}>Ok</button>
            <label htmlFor={id} className="button dangerous" onClick={this.handleCancelButtonClick.bind(this)}>
              Cancel
            </label>
          </footer>
        </article>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!!this.state.show === !!nextProps.show) { return; }

    this.setState({ show: !!nextProps.show }, this.toggleKeybindings.bind(this));
  }

  handleOkButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.handleConfirmed(true);
  }

  handleCancelButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.handleConfirmed(false);
  }

  toggleKeybindings () {
    if (this.state.show) {
      Mousetrap.bind('enter', (e) => {
        e.preventDefault();
        this.props.handleConfirmed(true);
      });

      Mousetrap.bind('esc', () => {
        this.props.handleConfirmed(false);
      });
    }
    else {
      Mousetrap.unbind('enter');
      Mousetrap.unbind('esc');
    }
  }
}

export default Dialog;
