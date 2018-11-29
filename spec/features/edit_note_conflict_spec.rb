# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Edit note with conflict', :js do
  context 'as logged in user' do
    let(:user) { User.create! email: 'user1@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf' }

    before { login_as user }

    scenario 'A copy of the note is created' do
      Timecop.travel(Time.local(2016, 8, 1, 15, 33)) do
        note = Note.create!(
          title: 'my note',
          user: user,
          content: 'note content',
          uid: SecureRandom.uuid
        )

        # load the note...
        visit_and_wait "/#/notes/#{note.uid}/edit"
        expect(page).to have_content 'my note'
        expect(page).to have_content 'note content'

        # ...in the meantime there's an edit
        note.update! content: '<p>note content - update 1</p>'

        find('.ql-editor').set('note content - update 2')

        after_save_cycle do
          expect(page).to have_content 'Saved'
        end

        expect(page).to have_content 'my note (conflict 2016-08-01 15:33)'

        # the note has the updated content
        expect(note.reload.content).to eq '<p>note content - update 2</p>'

        # the conflict copy has the old content
        expect(Note.last).to have_attributes(
          title: 'my note (conflict 2016-08-01 15:33)',
          content: '<p>note content - update 1</p>'
        )
      end
    end
  end
end
