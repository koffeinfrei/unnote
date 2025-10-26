<div class:hidden-sm={!showForm}>
  <input
    type="text"
    value={note.title}
    oninput={handleTitleChange}
    placeholder="Title"
    bind:this={titleElement}
  />

  <div bind:this={contentContainerElement}></div>
</div>

<script>
  import { onMount } from 'svelte'
  import './highlight.js'
  import Quill from 'quill'
  import { searchTerm } from './stores'
  import 'quill-task-list/task_list_node'
  import 'quill/dist/quill.snow.css'
  import EventHive from './EventHive'

  let { note, showForm, change } = $props();

  let shouldRerender = $state(true)
  let editor
  let titleElement
  let contentContainerElement
  let contentElement
  let previousNoteUid = $state()

  const handleTitleChange = () => {
    shouldRerender = false
    note.title = titleElement.value
    change(note)
  }

  const handleContentChange = () => {
    shouldRerender = false
    note.content = contentElement.innerHTML
    change(note)
  }

  const renderEditor = () => {
    editor = new Quill(contentContainerElement, {
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
    })

    contentElement = contentContainerElement.querySelector('.ql-editor')
  }

  const focusTitleFieldIfNewNote = () => {
    if (note.isNew()) {
      setTimeout(() => titleElement.focus(), 100)
    }
  }

  onMount(renderEditor)

  // React to note changes
  $effect(() => {
    // a different note is shown.
    if (titleElement && note.uid !== previousNoteUid) {
      previousNoteUid = note.uid
      shouldRerender = true
      focusTitleFieldIfNewNote()
    }
  })

  // Update editor content when shouldRerender is true
  $effect(() => {
    // don't rerender if the RTE content changes. the cursor jumps to the
    // beginning of the content if we re-initialize the RTE content.
    if (shouldRerender && editor) {
      editor.off('text-change')
      // reset the content before inserting the actual content.
      // presumably because of change tracking (delta stuff) in quill the
      // insertion of big content hangs the browser for several seconds.
      editor.setText('')
      contentElement.innerHTML = note.content
      // wait on updates so the state of the editor is up to date for clearing
      // the history and attaching events
      editor.update()
      editor.history.clear()
      editor.on('text-change', handleContentChange)
    }
  })
</script>

<style lang="sass">
  :global
    @import './stylesheets/quill.snow.custom'
    @import 'quill-task-list/task_list'
</style>
