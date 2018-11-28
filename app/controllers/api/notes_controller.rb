# frozen_string_literal: true

class Api::NotesController < AuthenticatedController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  def index
    @notes = policy_scope(Note.unarchived)

    if params[:search].present?
      @notes = @notes.search_by_title_and_content(params[:search])
    end

    @notes = @notes
      .default_ordered
      .limit(current_page * Kaminari.config.default_per_page)

    render json: {
      notes: @notes,
      current_page: current_page,
      has_more_pages: @notes.page(current_page).next_page.present?
    }
  end

  def show
    @note = Note.find_by!(uid: params[:id])

    authorize @note

    render json: {
      note: @note
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
      render json: {
        uid: @note.uid,
        created_at: @note.created_at,
        updated_at: @note.updated_at
      }, status: :ok
    else
      render json: { errors: @note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @note = Note.find_by(uid: params[:id])

    authorize @note

    if @note.destroy
      render json: {}, status: :ok
    else
      render json: { errors: @note.errors }, status: :unprocessable_entity
    end
  end

  private

  def note_params
    params.require(:note).permit(
      [:uid, :title, :content, :created_at, :updated_at, :archived_at]
    )
  end

  def current_page
    (params[:page].presence || 1).to_i
  end

  def handle_conflict
    # only consider milliseconds for the server date, as it may be more
    # specific (i.e. contain more fractional seconds) than the date we get from
    # the client. javascript only supports milliseconds.
    server_date = DateTime.iso8601(@note.updated_at.iso8601(3))
    client_date = DateTime.parse(params[:note][:server_updated_at])

    if server_date > client_date
      duplicated_note = @note.dup
      duplicated_note.update_attributes!(
        title: "#{duplicated_note.title} (conflict #{DateTime.now.strftime('%F %R')})"
      )
    end
  end
end
