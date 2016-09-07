class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # From the mobile app we don't want this.
  protect_from_forgery with: :exception, unless: -> { request.xhr? }

  layout :set_layout

  def layout
    'public'
  end

  private

  def set_layout
    request.xhr? ? false : layout
  end
end
