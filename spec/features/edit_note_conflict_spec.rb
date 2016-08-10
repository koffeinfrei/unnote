require 'rails_helper'

RSpec.feature 'Edit note with conflict', :js do
  context 'as logged in user' do
    let(:user) { User.create! email: 'user1@example.com', password: 'asdfasdf' }

    before { login_as user }

    scenario 'A copy of the note is created' do
      date = Time.local(2016, 8, 1, 15, 33)
      Timecop.freeze(date) do
        note = Note.create!(
          title: 'my note',
          user: user,
          content: 'note content',
          uid: SecureRandom.uuid
        )

        visit edit_note_path(note)

        js_timecop_freeze(date) do

          # in the meantime there's an edit
          note.update_attributes! content: 'note content - update 1'

          js_timecop_tick(1.second)

          find('.trumbowyg-editor').set(' - update 2')

          using_wait_time 6 do
            expect(page).to have_content 'Synced'
          end

          expect(page).to have_content 'my note (conflict 2016-08-01 15:33)'

          # the note has the updated content
          expect(note.reload.content).to eq 'note content - update 2<br>'

          # the conflict copy has the old content
          expect(Note.last).to have_attributes(
            title: 'my note (conflict 2016-08-01 15:33)',
            content: 'note content - update 1'
          )
        end
      end
    end
  end
end
