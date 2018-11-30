# frozen_string_literal: true

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = false

  config.before :suite do
    DatabaseCleaner.clean_with :deletion
  end

  config.around do |example|
    DatabaseCleaner.strategy =
      if example.metadata[:type] == :feature
        :deletion
      else
        :transaction
      end

    DatabaseCleaner.cleaning do
      example.run
    end
  end
end
