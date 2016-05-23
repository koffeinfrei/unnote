class NoteForm extends React.Component {
  render () {
    return (
      <form className="simple_form form-horizontal">
        <div className="form-inputs">
          <div className="form-group string optional note_title">
            <label className="string optional control-label" htmlFor="note_title">Title</label>
            <input
              type="text"
              className="string optional form-control"
              id="note_title"
              name="note[title]"
              value={this.props.title}
            />
          </div>
          <div className="form-group text optional note_content">
           <label className="text optional control-label" htmlFor="note_content">Content</label>
           <textarea id="note_content" className="text optional form-control" name="note[content]" value={this.props.content}>
           </textarea>
          </div>
        </div>
      </form>
    );
  }
}

NoteForm.propTypes = {
  notes: React.PropTypes.string,
  content: React.PropTypes.string
};
