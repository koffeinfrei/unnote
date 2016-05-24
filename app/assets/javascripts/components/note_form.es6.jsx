class NoteForm extends React.Component {
  render() {
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
              value={this.props.note.title}
            />
          </div>
          <div className="form-group text optional note_content">
           <label className="text optional control-label" htmlFor="note_content">Content</label>
           <textarea
             className="text optional form-control"
             id="note_content"
             name="note[content]"
             value={this.props.note.content}
           >
           </textarea>
          </div>
        </div>
      </form>
    );
  }

  handleContentChange(e) {
    console.debug('content changed', e.target.value);
  }

  componentDidMount() {
    this.renderEditor();
  }

  componentDidUpdate() {
    this.renderEditor();
  }

  renderEditor() {
    // TODO: rails asset path
    $.trumbowyg.svgPath = '/assets/trumbowyg/images/icons.svg';

    const $form = $(ReactDOM.findDOMNode(this));
    const $editor = $form.find('textarea');

    $editor.trumbowyg('destroy');
    $editor.trumbowyg({
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
    $editor.on('tbwchange', this.handleContentChange);
  }
}
