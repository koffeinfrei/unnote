# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tasks', :js do
  context 'as logged in user' do
    let(:user) { create_user(email: 'user1@example.com') }

    before { login_as user }

    it 'I can see and search all my task' do
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

      visit_and_wait '/#/tasks'

      # show all tasks
      expect(page).not_to have_content 'normal note'
      expect(page).to have_content 'note1 with tasks'
      expect(page).to have_content 'note2 with tasks'

      # search the task
      fill_in 'Search', with: 'note1'
      wait_for_finished_loading

      expect(page).to have_content 'note1 with tasks'
      expect(page).not_to have_content 'note2 with tasks'

      # search the normal note...
      fill_in 'Search', with: 'normal'
      wait_for_finished_loading

      # ...there's no task
      expect(page).not_to have_content 'note1 with tasks'
      expect(page).not_to have_content 'note2 with tasks'
      expect(page).to have_content "There's nothing…"
    end

    it 'I can check and uncheck tasks' do
      Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        title: 'note1 with tasks',
        content: '<ul class="task-list"><li>task a</li><li>task b</li></ul>'
      )

      visit_and_wait '/#/tasks'

      toggle_checkbox 'task a'

      expect(page).not_to have_content 'task a'

      find_button('toggle-done').click

      expect(page).to have_content 'task a'

      toggle_checkbox 'task a'

      expect(page).to have_content 'task a'

      # check both -> task note disappears
      toggle_checkbox 'task a'
      toggle_checkbox 'task b'

      after_save_cycle do
        expect(page).not_to have_content 'note1 with tasks'
        expect(page).to have_content "There's nothing…"
      end

      # show all (incl. done tasks)
      select 'Show all', from: 'view-filter'
      expect(page).to have_content 'note1 with tasks'
    end
  end
end
