# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NotesFinder do
  describe '.call' do
    it 'returns the user scoped notes' do
      user = create_user(email: 'user1@example.com')
      note = create_note(user: user)

      other_user = create_user(email: 'user2@example.com')
      create_note(user: other_user)

      notes = described_class.new(user).call

      expect(notes).to eq [note]
    end

    it 'limits the number of records' do
      user = create_user(email: 'user1@example.com')
      create_note(user: user)
      create_note(user: user)

      allow(Kaminari.config).to receive(:default_per_page).and_return(1)

      notes = described_class.new(user).call

      expect(notes.count).to eq 1
    end

    context 'with search param' do
      it 'calls the search method on notes' do
        user = create_user

        finder = described_class.new(user, search: 'term')

        notes = Note.none
        allow(notes).to receive(:search_by_title_and_content).and_return(notes)
        allow(finder).to receive(:user_scoped_notes).and_return(notes)

        finder.call

        expect(notes).to have_received(
          :search_by_title_and_content
        ).with('term')
      end
    end
  end
end
