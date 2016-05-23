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

  componentDidMount () {
    var $this = $(ReactDOM.findDOMNode(this));

    // TODO: rails asset path
    $.trumbowyg.svgPath = '/assets/trumbowyg/images/icons.svg';
    $this.find('textarea').trumbowyg({
      btns: [
        ['formatting'],
        'btnGrp-semantic',
        'btnGrp-lists',
        ['link'],
        ['insertImage'],
        'btnGrp-justify',
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
      ]
    });
  }
}

NoteForm.propTypes = {
  notes: React.PropTypes.string,
  content: React.PropTypes.string
};
