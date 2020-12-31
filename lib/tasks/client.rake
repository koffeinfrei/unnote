# frozen_string_literal: true

namespace :client do
  desc 'Install npm packages'
  task npm_install: :environment do
    abort 'Could not install the npm packages' unless system('cd client && npm install')
  end

  desc 'Build and deploy the client app to the public directory'
  task build_and_deploy: :environment do
    require 'deploy_client'

    abort 'Could not build and deploy the client app' unless DeployClient.new.deploy_public
  end

  desc 'Removes the deployed client files from the public directory'
  task clean: :environment do
    require 'deploy_client'

    abort 'Could not clean the client app from the public directory' unless DeployClient.new.cleanup_public
  end
end
