namespace :client do
  desc 'Install npm packages'
  task npm_install: :environment do
    unless system('cd client && npm install')
      abort 'Could not install the npm packages'
    end
  end

  desc 'Build and deploy the client app to the public directory'
  task build_and_deploy: :environment do
    require 'deploy_client'

    unless DeployClient.new.deploy_public
      abort 'Could not build and deploy the client app'
    end
  end

  desc 'Removes the deployed client files from the public directory'
  task clean: :environment do
    require 'deploy_client'

    unless DeployClient.new.cleanup_public
      abort 'Could not clean the client app from the public directory'
    end
  end
end
