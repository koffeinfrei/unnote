class NotesController < ApplicationController
  def index
    @notes = Note.all
  end

  def edit
    @note = Note.find(params[:id])
  end
end
