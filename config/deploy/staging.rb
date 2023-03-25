# frozen_string_literal: true

server 'mykonote-staging', user: 'deploy', roles: %w[web app db]

set :deploy_to, "/home/deploy/#{fetch :application}-staging"
