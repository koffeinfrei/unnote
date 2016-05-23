class NotesController < ApplicationController
  def index
    @notes = Note.all
  end

  def edit
    @notes = Note.all
    @note = Note.find(params[:id])
  end
end
