# frozen_string_literal: true

module WaitHelper
  def wait_for_finished_loading
    Timeout.timeout(Capybara.default_max_wait_time * 10) do
      loop while page.has_content?('.spinner')
    end
  end

  def after_save_cycle(&block)
    # worst case is we have to wait 1 full autosave polling cycle
    # (polling cycle is 5 seconds)
    using_wait_time 6, &block
  end
end

RSpec.configuration.include WaitHelper, type: :feature
