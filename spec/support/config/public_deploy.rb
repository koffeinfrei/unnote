# frozen_string_literal: true

RSpec.configure do |config|
  # only build the client when we run feature specs
  break if config.files_to_run.none? { |file| file.include?('features/') }

  deploy_client = DeployClient.new
  config.before :suite do
    puts '--> Building the client app and deploying it ' \
         'to the public directory...'

    deploy_client.deploy_public
  end
  config.after :suite do
    deploy_client.cleanup_public
  end
end
