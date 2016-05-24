Rails.application.routes.draw do
  resources :notes, only: [:index, :show, :edit]

  namespace :api do
    resources :notes
  end

  root 'notes#index'
end
