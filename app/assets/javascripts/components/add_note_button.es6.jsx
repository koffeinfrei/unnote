class AddNoteButton extends React.Component {
  render () {
    return (
      <a
        href="#"
        className="btn btn-info btn-fab btn-new-note"
        onClick={this.props.handleNewNoteClick}
      >
        <i className="material-icons">add</i>
      </a>
    );
  }
}
