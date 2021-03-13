# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Free subscription limt', :js do
  it 'Does not allow to create a new note when the limit is exceeded' do
    user = create_user(subscription: :free)
    Note.create! title: 'my_note', user: user, uid: SecureRandom.uuid
    stub_const('Note::FREE_COUNT_LIMIT', 1)

    login_as user

    visit_and_wait '/#/notes'

    fill_in 'Title', with: 'title'

    after_save_cycle do
      within '.card.warning' do
        expect(page).to have_content(
          'You have reached your note limit of 1 notes. ' \
          'Please delete some notes or upgrade your subscription'
        )
      end
    end

    expect(Note.count).to eq 1
  end
end
