# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    skip_before_action :verify_authenticity_token

    respond_to :json

    def authenticated?
      if user_signed_in?
        render json: {}, status: :ok
      else
        render json: {}, status: :unauthorized
      end
    end
  end
end
