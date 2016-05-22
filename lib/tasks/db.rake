namespace :db do
  # Define a helper to create or update seed records
  task seed: :seed_helper

  task :seed_helper do
    require 'seed'
    include Seed
  end
end
