class NotesController < ApplicationController
  def index
    @notes = Note.all
  end
end
