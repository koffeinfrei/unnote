Rails.application.routes.draw do
  resources :notes, only: [:index, :show, :edit]

  namespace :api do
    resources :notes, only: [:index, :update]
  end

  root 'notes#index'
end
