class NoteForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      id: this.props.id,
      title: this.props.title,
      content: this.props.content
    };
  }

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
              value={this.state.title}
              onChange={this.handleTitleChange.bind(this)}
            />
          </div>
          <div className="form-group text optional note_content">
           <label className="text optional control-label" htmlFor="note_content">Content</label>
           <textarea
             className="text optional form-control"
             id="note_content"
             name="note[content]"
             value={this.state.content}
           >
           </textarea>
          </div>
        </div>
      </form>
    );
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value }, this.handleChange);
  }

  handleContentChange(e) {
    this.setState({ content: e.target.value }, this.handleChange);
  }

  handleChange() {
    this.props.handleChange(
      {
        id: this.state.id,
        title: this.state.title,
        content: this.state.content
      }
    );
  }

  componentDidMount() {
    this.renderEditor();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.state.id) {
      return;
    }

    // a new entry was saved, we now got the id
    // from the server
    if (!$.isNumeric(this.state.id) && (this.state.title != '' || this.state.content != '')) {
      this.setState({
        id: nextProps.id
      });
    }
    // a different note is shown.
    // if the id is non-numeric, the current note
    // is a new (i.e. unsaved) note
    else {
      this.editorNeedsReRender = true;

      this.setState({
        id: nextProps.id,
        title: nextProps.title,
        content: nextProps.content
      });
    }
  }

  // only re-render the editor when `componentWillReceiveProps`
  // was called prior
  componentDidUpdate() {
    if (this.editorNeedsReRender) {
      this.editorNeedsReRender = false;
      this.renderEditor();
    }
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
        'btnGrp-justify',
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
      ]
    });
    $editor.on('tbwchange', this.handleContentChange.bind(this));
    $editor.on('tbwpaste', this.handleContentChange.bind(this));
  }
}
