class NotesController < ApplicationController
  def index
    @notes = Note.all
  end

  def edit
    @notes = Note.all
    @note = Note.find(params[:id])
    render_component notes: @notes, note: @note
  end
end
