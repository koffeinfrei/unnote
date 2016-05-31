class AuthenticatedController < ApplicationController
  include Pundit

  before_action :authenticate_user!
  after_action :verify_authorized

  rescue_from Pundit::NotAuthorizedError do
    flash[:alert] = t('unauthorized')

    if user_signed_in?
      redirect_to :root
    else
      redirect_to new_user_session_path
    end
  end

  def layout
    'application'
  end
end
