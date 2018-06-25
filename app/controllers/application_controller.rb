class ApplicationController < ActionController::Base
  protect_from_forgery only: []

  layout :set_layout

  def layout
    'public'
  end

  private

  def set_layout
    request.xhr? ? false : layout
  end
end
