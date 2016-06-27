class NotesController < AuthenticatedController
  def index
    authorize Note

    render :edit
  end

  def edit
    @note = Note.find_by_uid(params[:id])

    authorize @note

    render :edit
  end
end
