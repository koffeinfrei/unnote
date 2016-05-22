Rails.application.routes.draw do
  resources :notes
  mount ReactiveRecord::Engine => "/rr"

  root 'notes#index'
end
