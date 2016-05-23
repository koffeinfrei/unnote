class NotesController < ApplicationController
  def index
    @notes = Note.all

    render component: 'NoteList', props: { notes: @notes }
  end

  def edit
    @notes = Note.all
    @note = Note.find(params[:id])

    render component: 'NoteEdit', props: { notes: @notes, note: @note }
  end
end
