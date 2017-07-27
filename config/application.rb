require File.expand_path('../boot', __FILE__)

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Mykonote
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Require `belongs_to` associations by default
    config.active_record.belongs_to_required_by_default = true

    # Enable per-form CSRF tokens
    Rails.application.config.action_controller.per_form_csrf_tokens = true

    # Enable origin-checking CSRF mitigation
    Rails.application.config.action_controller.forgery_protection_origin_check = true

    # Do not halt callback chains when a callback returns false.
    ActiveSupport.halt_callback_chains_on_return_false = false

    # Make Ruby 2.4 preserve the timezone of the receiver when calling `to_time`.
    ActiveSupport.to_time_preserves_timezone = true

    config.middleware.use Rack::Deflater
  end
end
