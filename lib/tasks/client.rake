namespace :client do
  desc 'Install npm packages'
  task npm_install: :environment do
    `cd client && npm install`
  end

  desc 'Build and deploy the client app to the public directory'
  task build_and_deploy: :environment do
    require 'deploy_client'

    DeployClient.new.run
  end
end
