import './highlight.js';
import React, { Component } from 'react';
import Quill from 'quill';
import 'quill-task-list/task_list_node';
import 'quill/dist/quill.snow.css';
import './NoteForm.css';
import EventHive from './EventHive';

class NoteForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      note: this.props.note
    };

    this.shouldRerender = true;
  }

  render() {
    return (
      <div className={this.props.showForm ? undefined : 'hidden-sm'}>
        <form
          ref={(c) => this.formContainerElement = c}
          onSubmit={this.handleFormSubmit}>
          {this.renderTitle()}
          {this.renderContent()}
        </form>
      </div>
    );
  }

  renderTitle() {
    return (
      <input
        type="text"
        value={this.state.note.title}
        onChange={this.handleTitleChange.bind(this)}
        placeholder="Title"
        ref={(c) => this.titleElement = c}
      />
    );
  }

  renderContent() {
    return (
      <div ref={(c) => this.contentContainerElement = c}></div>
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
    const note = this.state.note;
    note.title = this.titleElement.value;
    this.setState({ note: note }, this.handleChange);
  }

  handleContentChange() {
    this.shouldRerender = false;
    const note = this.state.note;
    note.content = this.contentElement.innerHTML;
    this.setState({ note: note }, this.handleChange);
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
    this.noteUpdateSubscription = EventHive.subscribe('note.update', (data) => {
      this.titleElement.value = data.title;
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
    this.contentElement.innerHTML = this.state.note.content;
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

  componentWillUnmount() {
    this.noteUpdateSubscription.remove();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // don't rerender if the RTE content changes. the cursor jumps to the
    // beginning of the content if we re-initialize the RTE content.
    return this.shouldRerender;
  }

  renderEditor() {
    this.editor = new Quill(this.contentContainerElement, {
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
        'task-list': true
      }
    });

    this.contentElement = this.contentContainerElement.querySelector('.ql-editor');
  }

  focusTitleFieldIfNewNote() {
    if (this.state.note.isNew()) {
      this.titleElement.focus();
    }
  }
}

export default NoteForm;
