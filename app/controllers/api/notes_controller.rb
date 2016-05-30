class Api::NotesController < ApplicationController
  def index
    if params[:search].present?
      @notes = Note.search_by_title_and_content(params[:search])
    else
      @notes = Note.all
    end

    @notes = @notes.default_ordered

    render json: @notes
  end

  def update
    @note = Note.find_or_initialize_by(uid: params[:id])

    if @note.update_attributes(note_params)
      render json: @note, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  private

  def note_params
    params.require(:note).permit([:uid, :title, :content])
  end
end
