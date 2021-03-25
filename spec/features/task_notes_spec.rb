# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Task notes', :js do
  context 'as logged in user' do
    let(:user) { create_user(email: 'user1@example.com') }

    before { login_as user }

    it 'I can see and search all my task notes' do
      Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        title: 'normal note',
        content: '<ul><li>a</li><li>b</li></ul>'
      )
      Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        title: 'note1 with tasks',
        content: '<ul class="task-list"><li>a</li><li>b</li></ul>'
      )
      Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        title: 'note2 with tasks',
        content: '<ul class="task-list"><li>a</li><li>b</li></ul>'
      )

      visit_and_wait '/#/notes'

      # show all notes
      expect(page).to have_content 'normal note'
      expect(page).to have_content 'note1 with tasks'
      expect(page).to have_content 'note2 with tasks'

      # show only notes with tasks
      click_on 'Task notes'
      wait_for_finished_loading

      expect(page).not_to have_content 'normal note'
      expect(page).to have_content 'note1 with tasks'
      expect(page).to have_content 'note2 with tasks'

      # search the task note
      fill_in 'Search', with: 'note1'
      wait_for_finished_loading

      expect(page).not_to have_content 'normal note'
      expect(page).to have_content 'note1 with tasks'
      expect(page).not_to have_content 'note2 with tasks'

      # search the normal note...
      fill_in 'Search', with: 'normal'
      wait_for_finished_loading

      # ...there's not task note
      expect(page).not_to have_content 'normal note'
      expect(page).not_to have_content 'note1 with tasks'
      expect(page).not_to have_content 'note2 with tasks'
      expect(page).to have_content "There's nothing…"

      click_on 'All notes'
      wait_for_finished_loading

      # ...but a normal note
      expect(page).to have_content 'normal note'
      expect(page).not_to have_content 'note1 with tasks'
      expect(page).not_to have_content 'note2 with tasks'
      expect(page).not_to have_content "There's nothing…"

      # show all
      fill_in 'Search', with: ''
      expect(page).to have_content 'normal note'
      expect(page).to have_content 'note1 with tasks'
      expect(page).to have_content 'note2 with tasks'
    end
  end
end
