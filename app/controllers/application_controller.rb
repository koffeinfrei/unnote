class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  layout :set_layout

  def layout
    'application'
  end

  private

  def set_layout
    request.xhr? ? false : layout
  end
end
