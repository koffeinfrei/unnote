Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }

  resources :notes, only: [:index, :show, :edit]

  namespace :api do
    resources :notes, only: [:index, :update, :destroy]
  end

  root 'notes#index'
end
