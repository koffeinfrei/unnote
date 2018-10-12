# config valid only for current version of Capistrano
lock '3.10.2'

set :application, 'mykonote'
set :repo_url, 'git@github.com:panter/mykonote.git'

set :linked_files, fetch(:linked_files, []).push('.env')
set :linked_dirs, fetch(:linked_dirs, []).push('system')
