# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NoteContentCleaner do
  describe '#run' do
    let(:user) do
      User.create!(
        email: 'user@example.com',
        password: 'asdfasdf',
        password_confirmation: 'asdfasdf'
      )
    end

    let(:note) do
      Note.create!(
        content: 'content1<br>content2',
        uid: SecureRandom.uuid,
        user: user
      )
    end

    it 'returns the cleaned up content' do
      described_class.new(note).run!

      expect(note.reload.content).to eq '<p>content1</p><p>content2</p>'
    end
  end
end
