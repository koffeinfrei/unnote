# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Creating and editing notes', :js do
  context 'as logged in user' do
    let(:user) { create_user(email: 'user1@example.com') }

    before { login_as user }

    it 'I can create and edit notes going back and forth between them' do
      Note.create!(
        title: 'note 1',
        content: 'note 1 content',
        user: user,
        uid: SecureRandom.uuid
      )

      visit_and_wait '/#/notes'

      # update 1st note, 1st time
      find('.list-item', text: 'note 1').click
      fill_in 'Title', with: 'note 1'
      find('.ql-editor').set('note 1 content update 1')

      sleep 0.5

      # create 2nd note
      click_button 'new'
      fill_in 'Title', with: 'note 2'
      find('.ql-editor').set('note 2 content')

      sleep 0.5

      # update 1st note, 2nd time
      find('.list-item', text: 'note 1').click
      fill_in 'Title', with: 'note 1 update 2'
      find('.ql-editor').set('note 1 content update 2')

      sleep 0.5

      # update 2nd note
      find('.list-item', text: 'note 2').click
      fill_in 'Title', with: 'note 2 update 1'
      find('.ql-editor').set('note 2 content update 1')

      sleep 0.5

      # create 3rd note
      click_button 'new'
      fill_in 'Title', with: 'note 3'
      find('.ql-editor').set('note 3 content')

      after_save_cycle do
        expect(page).to have_content 'note 1 update 2'
        expect(page).to have_content 'note 2 update 1'
        expect(page).to have_content 'note 3'

        find('.list-item', text: 'note 1 update 2').click
        expect(page).to have_content 'note 1 content update 2'

        find('.list-item', text: 'note 2 update 1').click
        expect(page).to have_content 'note 2 content update 1'

        find('.list-item', text: 'note 3').click
        expect(page).to have_content 'note 3 content'

        expect(page).not_to have_content 'conflict'

        expect(Note.all.pluck(:title, :text_content)).to contain_exactly(
          ['note 1 update 2', '<p>note 1 content update 2</p>'],
          ['note 2 update 1', '<p>note 2 content update 1</p>'],
          ['note 3', '<p>note 3 content</p>']
        )
      end
    end
  end
end
