class NotesController < ApplicationController
  def index
    render component: 'NoteList', props: { url: api_notes_path }
  end

  def edit
    render component: 'NoteEdit', props: { url: api_notes_path }
  end
end
