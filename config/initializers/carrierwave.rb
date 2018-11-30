# frozen_string_literal: true

CarrierWave.configure do |config|
  # make dir and files available only to the user running the servers
  config.permissions = 0o600
  config.directory_permissions = 0o700

  config.storage = :file

  # avoid uploaded files from saving to public/
  config.root = Rails.root.join('system')
end
