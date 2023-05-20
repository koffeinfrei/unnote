# frozen_string_literal: true

server 'mykonote-production', user: 'deploy', roles: %w[web app db]

set :deploy_to, "/home/deploy/#{fetch :application}"

# custom var, used for PWA name
set :application_name, 'Mykonote'
