# frozen_string_literal: true

lock '~> 3.17.2'

set :application, 'mykonote'
set :repo_url, 'git@github.com:koffeinfrei/mykonote-new.git'
set :branch, 'chores/new-passenger-deployment' # TODO: change to main
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

set :deploy_to, "/home/deploy/#{fetch :application}"

append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', '.bundle', 'system'

set :keep_releases, 5

desc 'Build and deploy the client app to the public directory'
task :deploy_client do
  on roles(:web) do
    within release_path do
      with rails_env: fetch(:rails_env) do
        execute :rake, 'client:npm_install CI=true'
        execute :rake, 'client:build_and_deploy'
      end
    end
  end
end
before 'deploy:updated', 'deploy_client'
