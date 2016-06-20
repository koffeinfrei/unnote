# use the same config as production
load Rails.root.join(File.dirname(__FILE__), 'production.rb')

Rails.application.configure do
  config.serve_static_files = true
  config.assets.compile = true

  config.log_level = :debug
end
