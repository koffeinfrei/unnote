# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Notes list', :js do
  context 'as logged in user' do
    let(:user) { create_user(email: 'user1@example.com') }

    before { login_as user }

    it 'I can see all my notes' do
      other_user = create_user(email: 'user2@example.com')
      Note.create!(
        title: 'my_note',
        user: user,
        uid: SecureRandom.uuid
      )
      Note.create!(
        title: 'archived_note',
        user: user,
        uid: SecureRandom.uuid,
        archived_at: Time.zone.local(2016, 8, 1, 15, 33)
      )
      Note.create!(
        title: 'other_note',
        user: other_user,
        uid: SecureRandom.uuid
      )

      visit_and_wait '/#/notes'

      expect(page).to have_content 'my_note'
      expect(page).not_to have_content 'other_note'
      expect(page).not_to have_content 'archived_note'
    end
  end

  context 'as anonymous user' do
    it 'I need to login' do
      visit_and_wait '/'

      expect(page).to have_button 'Log in'
    end
  end
end
