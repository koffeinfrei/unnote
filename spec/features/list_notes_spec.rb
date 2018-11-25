require 'rails_helper'

RSpec.feature 'Notes list', :js do
  context 'as logged in user' do
    let(:user) { User.create! email: 'user1@example.com', password: 'asdfasdf' }

    before { login_as user }

    scenario 'I can see all my notes' do
      other_user = User.create! email: 'user2@example.com', password: 'asdfasdf'
      Note.create! title: 'my_note', user: user, uid: SecureRandom.uuid
      Note.create! title: 'archived_note', user: user, uid: SecureRandom.uuid, archived_at: Time.local(2016, 8, 1, 15, 33)
      Note.create! title: 'other_note', user: other_user, uid: SecureRandom.uuid

      visit '/#/notes'
      wait_for_finished_loading

      expect(page).to have_content 'my_note'
      expect(page).not_to have_content 'other_note'
      expect(page).not_to have_content 'archived_note'
    end
  end

  context 'as anonymous user' do
    scenario 'I need to login' do
      visit '/'

      expect(page).to have_button 'Log in'
    end
  end
end
