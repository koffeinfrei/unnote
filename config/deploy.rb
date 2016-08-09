# config valid only for current version of Capistrano
lock '3.6.0'

set :application, 'mykonote'
set :repo_url, 'git@github.com:panter/mykonote.git'

set :linked_files, fetch(:linked_files, []).push('.env')

namespace :bower do
  desc 'Install bower'
  task :install do
    on roles(:web) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'bower:install CI=true'
        end
      end
    end
  end
end
before 'deploy:compile_assets', 'bower:install'
