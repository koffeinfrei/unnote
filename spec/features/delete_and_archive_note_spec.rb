# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Notes list', :js do
  context 'as logged in user' do
    let(:user) { create_user(email: 'user1@example.com') }

    before { login_as user }

    it 'I can delete my note' do
      Note.create!(
        title: 'my_note',
        user: user,
        uid: SecureRandom.uuid
      )

      visit_and_wait '/#/notes'

      expect(page).to have_content 'my_note'

      click_button 'delete-note'

      expect(page).to have_content 'Are you sure you want to delete this note?'

      click_button 'Ok'

      after_save_cycle do
        expect(page).not_to have_content 'my_note'
      end
    end

    it 'I can archive my note' do
      Note.create!(
        title: 'my_note',
        user: user,
        uid: SecureRandom.uuid
      )

      visit_and_wait '/#/notes'

      expect(page).to have_content 'my_note'

      click_button 'archive-note'

      expect(page).to have_content 'Are you sure you want to archive this note?'

      click_button 'Ok'

      after_save_cycle do
        expect(page).not_to have_content 'my_note'
      end
    end
  end
end
