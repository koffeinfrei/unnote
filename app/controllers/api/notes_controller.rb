# frozen_string_literal: true

module Api
  class NotesController < AuthenticatedController
    after_action :verify_authorized, except: :index

    def index
      finder = NotesFinder.new(current_user, params)
      @notes = finder.call

      render json: {
        notes: @notes,
        current_page: finder.current_page,
        has_more_pages: finder.more_pages?
      }
    end

    def show
      @note = Note.find_by(uid: params[:id])

      if @note
        authorize @note

        render json: {
          note: @note
        }
      else
        skip_authorization

        render json: {}, status: :not_found
      end
    end

    def update
      @note = Note.find_or_initialize_by(uid: params[:id])

      authorize_update

      if @note.update(note_params)
        json = @note.as_json(only: %i[uid created_at updated_at])
        render json: json, status: :ok
      else
        render json: {
          errors: @note.errors.full_messages
        }, status: :unprocessable_entity
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
        %i[uid title content created_at updated_at archived_at]
      )
    end

    def handle_conflict
      # only consider milliseconds for the server date, as it may be more
      # specific (i.e. contain more fractional seconds) than the date we get
      # from the client. javascript only supports milliseconds.
      server_date = Time.iso8601(@note.updated_at.iso8601(3))
      client_date = Time.zone.parse(params[:note][:server_updated_at])

      return if server_date <= client_date

      conflict_date = Time.current.strftime('%F %R')
      conflict_note = @note.dup
      conflict_note.update!(
        title: "#{conflict_note.title} (conflict #{conflict_date})"
      )
    end

    def authorize_update
      if @note.new_record?
        authorize @note, :create?
        @note.user = current_user
      else
        authorize @note

        handle_conflict
      end
    end
  end
end
