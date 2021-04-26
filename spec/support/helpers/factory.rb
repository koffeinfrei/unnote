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

  def build_note(attributes = {})
    attributes = {
      uid: SecureRandom.uuid
    }.merge(attributes)

    Note.new(attributes)
  end

  def create_note(attributes = {})
    note = build_note(attributes)
    note.save!
    note
  end
end

RSpec.configuration.include Factory
