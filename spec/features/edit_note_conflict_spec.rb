# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Edit note with conflict', :js do
  include ActiveSupport::Testing::TimeHelpers

  context 'as logged in user' do
    let(:user) { create_user }

    before { login_as user }

    it 'A copy of the note is created' do
      travel_to Time.zone.local(2016, 8, 1, 15, 33)

      note = Note.create!(
        title: 'my note',
        user: user,
        content: 'note content',
        uid: SecureRandom.uuid
      )

      # load the note...
      visit_and_wait "/#/notes/#{note.uid}"
      expect(page).to have_content 'my note'
      expect(page).to have_content 'note content'

      # ...in the meantime there's an edit
      travel_to Time.zone.local(2016, 8, 1, 15, 34)
      note.update! content: '<p>note content - update 1</p>'

      travel_to Time.zone.local(2016, 8, 1, 15, 35)
      find('.ql-editor').set('note content - update 2')

      after_save_cycle do
        expect(page).to have_content 'SAVED'
      end

      expect(page).to have_content 'my note (conflict 2016-08-01 15:35)'

      # the note has the updated content
      expect(note.reload.content).to eq '<p>note content - update 2</p>'

      # the conflict copy has the old content
      expect(Note.last).to have_attributes(
        title: 'my note (conflict 2016-08-01 15:35)',
        content: '<p>note content - update 1</p>'
      )
    end
  end
end
