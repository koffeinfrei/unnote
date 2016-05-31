class NotesController < AuthenticatedController
  def index
    authorize Note

    render component: 'NoteEdit', props: { url: api_notes_path }
  end

  def edit
    @note = Note.find_by_uid(params[:id])

    authorize @note

    render component: 'NoteEdit', props: {
      url: api_notes_path,
      uid: @note.uid,
      title: @note.title,
      content: @note.content
    }
  end
end
