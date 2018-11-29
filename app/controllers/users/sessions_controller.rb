# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token

  respond_to :json

  def is_authenticated
    if user_signed_in?
      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end
end
