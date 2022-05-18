class Api::SessionsController < ApplicationController

    # Verify the username/password and set the session token
    def create
        user = User.find_by_credentials(
            params[:user][:username],
            params[:user][:password]
        )
        if !user.is_a?(User)
        # either username not found or password incorrect
        # return value is a Hash in the format of user.errors.messages
            render json: {user: nil, errors: user}
        else
        # sign in the user
            login!(user)
            render partial: 'api/users/user', locals: {user: current_user}
        end
    end


    def destroy
    # sign out
        if current_user.nil?
            # if there is no user to logout
            # render a 404 message
            render json: {status: 404}
        else
            # If there is a current user
            # render an empty {} upon successful logout
            logout!
            render json: {}
        end
    end

end
