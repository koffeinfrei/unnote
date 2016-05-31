# Exposes common login and logout methods for
# all the different spec types to use.
module AuthenticationHelper
  def test_login(user)
    type = RSpec.current_example.metadata[:type]
    case type
    when :helper, :controller
      sign_in :user, user
    when :feature
      login_as user, scope: :user
    end
  end

  def test_logout
    logout
  end
end

RSpec.configure do |config|
  config.include Warden::Test::Helpers, type: :feature

  config.include Devise::TestHelpers, type: :controller

  config.before(:suite) do
    Warden.test_mode!
  end

  config.include AuthenticationHelper
end
