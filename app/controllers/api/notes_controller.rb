class Api::NotesController < AuthenticatedController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  def index
    if params[:search].present?
      @notes = Note.search_by_title_and_content(params[:search])
    else
      @notes = Note.all
    end

    @notes = policy_scope(@notes.default_ordered)

    @notes = @notes.limit(current_page * Kaminari.config.default_per_page)

    render json: {
      notes: @notes,
      current_page: current_page,
      has_more_pages: @notes.page(current_page).next_page.present?
    }
  end

  def update
    @note = Note.find_or_initialize_by(uid: params[:id])

    if @note.new_record?
      authorize @note, :create?
      @note.user = current_user
    else
      authorize @note

      handle_conflict
    end

    if @note.update_attributes(note_params)
      render json: {}, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @note = Note.find_by(uid: params[:id])

    authorize @note

    if @note.destroy
      render json: {}, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  private

  def note_params
    params.require(:note).permit(
      [:uid, :title, :content, :created_at, :updated_at]
    )
  end

  def current_page
    (params[:page].presence || 1).to_i
  end

  def handle_conflict
    if @note.updated_at.to_datetime > DateTime.parse(params[:note][:updated_at])
      duplicated_note = @note.dup
      duplicated_note.update_attributes!(
        title: "#{duplicated_note.title} (conflict #{DateTime.now.strftime('%F %R')})",
        uid: SecureRandom.uuid
      )
    end
  end
end
