class NoteForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      note: this.props.note
    };

    this.shouldRerender = true;
  }

  render() {
    return (
      <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
        <div className="form-inputs">
          <div className="form-group form-group-no-label string optional">
            <input
              type="text"
              className="string optional form-control"
              value={this.state.note.title}
              onChange={this.handleTitleChange.bind(this)}
              placeholder="Title"
              ref={(c) => this.$title = $(c)}
            />
          </div>
          <div className="form-group form-group-no-label text optional">
            <div
              ref={(c) => this.$contentContainer = $(c)}
            ></div>
          </div>
        </div>
      </form>
    );
  }

  // prevent form submission by hitting enter.
  // changes will be asynchronously saved by ajax.
  handleFormSubmit(e) {
    e.preventDefault();
    return false;
  }

  handleTitleChange() {
    this.shouldRerender = true;
    this.state.note.title = this.$title.val();
    this.setState({ note: this.state.note }, this.handleChange);
  }

  handleContentChange() {
    this.shouldRerender = false;
    this.state.note.content = this.$content.html();
    this.setState({ note: this.state.note }, this.handleChange);
  }

  handleChange() {
    this.props.handleChange(this.state.note);
  }

  componentDidMount() {
    this.focusTitleFieldIfNewNote();
    this.renderEditor();

    // when updating the note from outside (e.g. from the mobile app), in which
    // case a sync to the server should be triggered. if we just use the react
    // eventing the rte won't detect the changes.
    EventHive.subscribe('note.update', (data) => {
      this.$title.val(data.title);
      this.handleTitleChange();
      this.editor.pasteHTML(data.content);
    });
  }

  // gets called initially and when a note is switched
  componentDidUpdate() {
    this.editor.off('text-change');
    // reset the content before inserting the actual content.
    // presumably because of change tracking (delta stuff) in quill the
    // insertion of big content hangs the browser for several seconds.
    this.editor.setText('');
    this.$content.html(this.state.note.content);
    this.editor.history.clear();
    // wait on updates before attaching the `text-change` event
    this.editor.update();
    this.editor.on('text-change', this.handleContentChange.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    // a different note is shown.
    if (nextProps.note.uid !== this.state.note.uid) {
      this.shouldRerender = true;
      this.setState({
        note: nextProps.note
      }, () => this.focusTitleFieldIfNewNote());
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // don't rerender if the RTE content changes. the cursor jumps to the
    // beginning of the content if we re-initialize the RTE content.
    return this.shouldRerender;
  }

  renderEditor() {
    this.editor = new Quill(this.$contentContainer.get(0), {
      theme: 'snow',
      modules: {
        'syntax': true,
        'toolbar': [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          ['blockquote', 'code-block'],
          [
            { 'list': 'ordered' }, { 'list': 'bullet' }, 'task-list',
            { 'indent': '-1' }, { 'indent': '+1' }
          ],
          ['link', 'image'],
          ['clean']
        ],
        'task-list': {
          onClick: this.handleContentChange.bind(this)
        }
      }
    });

    this.$content = this.$contentContainer.find('.ql-editor');
  }

  focusTitleFieldIfNewNote() {
    if (this.state.note.isNew()) {
      this.$title.focus();
    }
  }
}
