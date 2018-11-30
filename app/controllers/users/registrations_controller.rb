# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    skip_before_action :verify_authenticity_token

    respond_to :json

    # rubocop:disable Metrics/MethodLength
    def create
      super do |resource|
        unless resource.persisted?
          clean_up_passwords(resource)
          set_minimum_password_length

          return render(
            json: { errors: resource.errors.full_messages },
            status: :unprocessable_entity
          )
        end

        GetStartedNoteCreator.new(resource).run
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
