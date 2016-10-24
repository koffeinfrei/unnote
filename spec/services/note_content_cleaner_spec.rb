require 'rails_helper'

RSpec.describe NoteContentCleaner do
  describe '#run' do
    it 'returns the cleaned up content' do
      note = Note.create!(
        content: 'content1<br>content2',
        uid: SecureRandom.uuid
      )

      expect(NoteContentCleaner.new(note).run).to eq '<p>content1</p><p>content2</p>'
    end
  end
end
