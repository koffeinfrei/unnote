# frozen_string_literal: true

Capybara.register_driver :firefox_headless do |app|
  options = ::Selenium::WebDriver::Firefox::Options.new
  options.args << '--headless'

  Capybara::Selenium::Driver.new(app, browser: :firefox, options: options)
end

Capybara.register_driver :firefox do |app|
  options = ::Selenium::WebDriver::Firefox::Options.new

  Capybara::Selenium::Driver.new(app, browser: :firefox, options: options)
end

Capybara.javascript_driver =
  if ENV['DRIVER'].present?
    ENV['DRIVER'].to_sym
  else
    :firefox_headless
  end

Capybara.server = :webrick

# From https://github.com/mattheworiordan/capybara-screenshot/issues/84#issuecomment-41219326
Capybara::Screenshot.register_driver(:firefox_headless) do |driver, path|
  driver.browser.save_screenshot(path)
end
Capybara::Screenshot.register_driver(:firefox) do |driver, path|
  driver.browser.save_screenshot(path)
end
