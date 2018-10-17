ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'spec_helper'
require 'rspec/rails'
require 'pundit/rspec'
require 'paper_trail/frameworks/rspec'
require 'capybara-screenshot/rspec'
require 'deploy_client'

Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# Checks for pending migration and applies them before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = false

  deploy_client = DeployClient.new
  config.before :suite do
    puts '--> Building the client app and deploying it to the public directory...'

    deploy_client.run
  end
  config.after :suite do
    deploy_client.clean
  end

  config.before :suite do
    DatabaseCleaner.clean_with :deletion
  end

  config.around(:each) do |example|
    DatabaseCleaner.strategy =
      if example.metadata[:type] == :feature
        :deletion
      else
        :transaction
      end

    DatabaseCleaner.cleaning do
      example.run
    end
  end

  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
end

Capybara.register_driver :firefox_headless do |app|
  options = ::Selenium::WebDriver::Firefox::Options.new
  options.args << '--headless'

  Capybara::Selenium::Driver.new(app, browser: :firefox, options: options)
end

Capybara.javascript_driver = :firefox_headless

Capybara.server = :webrick

# From https://github.com/mattheworiordan/capybara-screenshot/issues/84#issuecomment-41219326
Capybara::Screenshot.register_driver(:firefox_headless) do |driver, path|
  driver.browser.save_screenshot(path)
end
