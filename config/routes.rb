Rails.application.routes.draw do
    get 'static_pages/root'
    root 'static_pages#root'
end
