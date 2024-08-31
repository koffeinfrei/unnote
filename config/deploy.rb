# frozen_string_literal: true

lock '~> 3.19.1'

set :application, 'unnote'
set :repo_url, 'git@github.com:koffeinfrei/unnote.git'
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

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
after 'deploy_client', 'set_application_name' do
  on roles(:web) do
    within release_path do
      execute :sed, '-i', %('s/"unnote"/"#{fetch(:application_name)}"/g'), 'public/manifest.json'
    end
  end
end
