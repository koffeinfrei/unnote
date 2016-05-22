Rails.application.routes.draw do
  resources :notes

  root 'notes#index'
end
