# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token

  respond_to :json

  def create
    super do |resource|
      unless resource.persisted?
        clean_up_passwords resource
        set_minimum_password_length
        return render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
      end

      GetStartedNoteCreator.new(resource).run
    end
  end
end
