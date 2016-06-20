# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# fix asset paths for bower components that use relative paths
bower_asset_paths = [
  'vendor/assets/bower_components/bootstrap-sass/assets/stylesheets'
]
# include bower assets in precompilation
bower_precompile_paths = %w[
  trumbowyg/dist/ui/icons.svg
]

# Add additional assets to the asset load path
Rails.application.config.assets.paths += bower_asset_paths

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += bower_precompile_paths

# Workaround for react server side rendering
Rails.application.config.assets.precompile += %w(server_rendering.js)
