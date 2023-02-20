# frozen_string_literal: true

source 'https://rubygems.org'

gem 'rails', '~> 6.1.3'

# gems sorted alphabetically

gem 'bootsnap', require: false
gem 'capistrano', '~> 3.11'
gem 'capistrano-passenger', '~> 0.2.0'
gem 'capistrano-rails', '~> 1.4'
gem 'capistrano-rbenv', '~> 2.1', '>= 2.1.4'
gem 'carrierwave'
gem 'carrierwave-base64_image_content'
gem 'devise'
gem 'foreman'
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
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller' # Needed by better_errors to enable html console
  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
  gem 'seed_box'
end

group :test do
  gem 'timecop'
end
