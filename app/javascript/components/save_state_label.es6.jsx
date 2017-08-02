class SaveStateLabel extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { isSynced: props.isSynced };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isSynced: nextProps.isSynced });
  }

  render () {
    return (
      <div className="save-state">
        {
          this.state.isSynced
            ?
            <div className="label label-success">Saved</div>
            :
            <div className="label label-warning">Saving</div>
        }
      </div>
    );
  }
}

