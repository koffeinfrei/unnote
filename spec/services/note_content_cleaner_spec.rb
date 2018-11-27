require 'rails_helper'

RSpec.describe NoteContentCleaner do
  describe '#run' do
    it 'returns the cleaned up content' do
      note = Note.create!(
        content: 'content1<br>content2',
        uid: SecureRandom.uuid,
        user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf')
      )

      NoteContentCleaner.new(note).run!

      expect(note.reload.content).to eq '<p>content1</p><p>content2</p>'
    end
  end
end
