Rails.application.routes.draw do
    namespace :api, defaults: { format: :json } do
        resource :user, only: [:create]
        resource :session, only: [:create, :destroy]
    end
    get 'static_pages/root'
    root 'static_pages#root'
    get 'stock_symbols', :to => redirect('/stock_symbols.txt')
end
