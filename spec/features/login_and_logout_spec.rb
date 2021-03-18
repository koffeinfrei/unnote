# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Login and logout', :js do
  it 'An existing user can login' do
    create_user(email: 'user@example.com')

    visit_and_wait '/'

    # wrong password
    fill_in 'Email', with: 'user@example.com'
    fill_in 'Password', with: 'wrong'
    click_on 'Log in'

    within '.card.warning' do
      expect(page).to have_content(
        'Sorry, that did not work. Did you enter a wrong username or a wrong password?'
      )
    end

    # correct password
    fill_in 'Email', with: 'user@example.com'
    fill_in 'Password', with: 'asdfasdf'
    click_on 'Log in'

    expect(page).to have_content 'SAVED'
  end

  it 'I can logout' do
    user = create_user(email: 'user@example.com')
    login_as user

    visit_and_wait '/'

    click_button 'logout'

    expect(page).to have_button 'Log in'
  end
end
