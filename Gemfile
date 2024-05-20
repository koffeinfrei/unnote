# frozen_string_literal: true

source 'https://rubygems.org'

gem 'rails', '~> 7.1.1'

# gems sorted alphabetically

gem 'bootsnap', require: false
gem 'capistrano', '~> 3.11'
gem 'capistrano-passenger', '~> 0.2.0'
gem 'capistrano-rails', '~> 1.4'
gem 'capistrano-rbenv', '~> 2.1', '>= 2.1.4'
gem 'carrierwave', '~> 2.2'
gem 'carrierwave-base64_image_content'
gem 'devise'
gem 'kaminari'
gem 'nokogiri'
gem 'paper_trail'
gem 'pg'
gem 'pg_search'
gem 'pundit'
gem 'selenium-webdriver'

group :development, :test do
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'database_cleaner'
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'rspec-rails'
  gem 'spring'
  gem 'spring-commands-rspec'
  gem 'webrick'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller' # Needed by better_errors to enable html console
  gem 'rubocop', '~> 1.48', require: false
  gem 'rubocop-performance', '~> 1.16', require: false
  gem 'rubocop-rails', '~> 2.25', require: false
  gem 'rubocop-rspec', '~> 2.19', require: false
  gem 'seed_box'
end

group :test do
  gem 'timecop'
end
