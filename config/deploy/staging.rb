# frozen_string_literal: true

server 'unnote-staging', user: 'deploy', roles: %w[web app db]

set :deploy_to, "/home/deploy/#{fetch :application}-staging"

# custom var, used for PWA name
set :application_name, 'unnote [staging]'
