# config valid only for current version of Capistrano
lock '3.10.2'

set :application, 'mykonote'
set :repo_url, 'git@github.com:panter/mykonote.git'

set :linked_files, fetch(:linked_files, []).push('.env')
set :linked_dirs, fetch(:linked_dirs, []).push('system')

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
