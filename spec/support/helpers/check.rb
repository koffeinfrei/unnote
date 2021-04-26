# frozen_string_literal: true

module CheckHelper
  def toggle_checkbox(text)
    find('.checkable', text: text).click
  end
end

RSpec.configuration.include CheckHelper, type: :feature
