require 'rails_helper'

RSpec.feature 'Free subscription limt', :js do
  scenario 'Does not allow to create a new note when the limit is exceeded' do
    user = User.create! email: 'user1@example.com', password: 'asdfasdf', subscription: :free
    Note.create! title: 'my_note', user: user, uid: SecureRandom.uuid
    stub_const('Note::FREE_COUNT_LIMIT', 1)

    login_as user

    visit "/#/notes"

    fill_in 'Title', with: 'title'

    # worst case is we have to wait 1 full autosave polling cycle
    # (polling cycle is 5 seconds)
    using_wait_time 6 do
      within '.alert' do
        expect(page).to have_content(
          'You have reached your note limit of 1 notes. Please delete some notes or upgrade your subscription'
        )
      end
    end

    expect(Note.count).to eq 1
  end
end
