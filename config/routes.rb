# frozen_string_literal: true

Rails.application.routes.draw do
  get 'clients/index', to: 'clients#index'
  root to: 'clients#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  devise_scope :user do
    get 'users/is_authenticated', to: 'users/sessions#authenticated?'
  end

  namespace :api do
    resources :notes, only: %i[index show update destroy]
  end
end
