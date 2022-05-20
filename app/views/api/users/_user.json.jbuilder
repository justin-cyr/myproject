 json.user do 
    json.extract! user, :username, :session_token
 end
 json.errors user.errors.messages