Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }

  devise_scope :user do
    get 'users/is_authenticated', to: 'users/sessions#is_authenticated'
  end

  namespace :api do
    resources :notes, only: [:index, :show, :update, :destroy]
  end
end
