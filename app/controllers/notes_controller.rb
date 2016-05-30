class NotesController < ApplicationController
  def index
    render component: 'NoteEdit', props: { url: api_notes_path }
  end

  def edit
    @note = Note.find_by_uid(params[:id])
    render component: 'NoteEdit', props: {
      url: api_notes_path,
      uid: @note.uid,
      title: @note.title,
      content: @note.content
    }
  end
end
