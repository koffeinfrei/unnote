class NotesController < ApplicationController
  def index
    @notes = Note.all
  end

  def edit
    @notes = Note.all
    @note = Note.find(params[:id])

    render component: 'NoteForm', props: { notes: @notes, note: @note }
  end
end
