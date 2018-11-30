# frozen_string_literal: true

module Factory
  def create_user(attributes = {})
    attributes = {
      email: 'user@example.com',
      password: 'asdfasdf',
      password_confirmation: 'asdfasdf'
    }.merge(attributes)

    User.create!(attributes)
  end

  def create_note(attributes = {})
    attributes = {
      uid: SecureRandom.uuid
    }.merge(attributes)

    Note.create!(attributes)
  end
end

RSpec.configuration.include Factory
