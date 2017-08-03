# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# fix asset paths for bower components that use relative paths
bower_asset_paths = [
  'vendor/assets/bower_components/bootstrap-sass/assets/stylesheets'
]

# Add additional assets to the asset load path
Rails.application.config.assets.paths += bower_asset_paths

# Test js
Rails.application.config.assets.precompile += %w(application_test.js)
