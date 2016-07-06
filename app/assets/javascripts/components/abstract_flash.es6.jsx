class AbstractFlash extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { message: props.message };
  }

  render () {
    if (!this.state.message) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <div className={this.getCssClass()}>
            <button className="close" type="button" onClick={this.handleClose.bind(this)}>×</button>
            {this.state.message}
          </div>
        </div>
      </div>
    );
  }

  getCssClass() {
    var cssClasses = ['alert', 'alert-dismissible', this.getAdditionalCssClass()];

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
}
