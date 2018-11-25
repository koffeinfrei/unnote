require 'rails_helper'

RSpec.feature 'Register a new user', :js do
  scenario 'A new user is registered with a free subscription and a get started note' do
    visit '/#'

    click_on 'Register'

    fill_in 'Email', with: 'user@example.com'
    fill_in 'Password', with: 'asdfasdf'
    fill_in 'Confirm password', with: 'bogus'

    click_on 'Register'

    within '.alert' do
      expect(page).to have_content "Password confirmation doesn't match Password"
    end

    fill_in 'Confirm password', with: 'asdfasdf'

    click_on 'Register'

    within '.alert' do
      expect(page).to have_content 'Great! Glad you made it!'
    end

    within '.notes-list' do
      expect(page).to have_content 'Get started'
    end

    expect(User.last).to have_attributes(subscription: 'free')
  end
end
