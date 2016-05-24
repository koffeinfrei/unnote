class NoteForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { title: '', content: '' };
  }

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
              value={this.state.title}
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
