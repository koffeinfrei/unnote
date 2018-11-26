module VisitHelper
  def visit_and_wait(path)
    visit path
    wait_for_finished_loading
  end
end

RSpec.configuration.include VisitHelper, type: :feature
