Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }

  devise_scope :user do
    get 'users/is_authenticated', to: 'users/sessions#is_authenticated'
  end

  resources :notes, only: [:index, :show, :edit]

  namespace :api do
    resources :notes, only: [:index, :update, :destroy]
  end

  root 'notes#index'
end
