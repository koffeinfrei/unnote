module LoadingHelper
  def wait_for_finished_loading
    Timeout.timeout(Capybara.default_max_wait_time * 10) do
      loop until !page.has_content?('.spinner')
    end
  end
end

RSpec.configuration.include LoadingHelper, type: :feature
