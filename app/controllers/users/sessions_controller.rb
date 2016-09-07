class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    super do |resource|
      return respond_with(
        { location: after_sign_in_path_for(resource)}, # serialized to json
        location: after_sign_in_path_for(resource)
      )
    end
  end

  def is_authenticated
    if user_signed_in?
      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end
end
