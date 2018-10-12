# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Workaround for react server side rendering
Rails.application.config.assets.precompile += %w(server_rendering.js)

# Test js
Rails.application.config.assets.precompile += %w(application_test.js)
