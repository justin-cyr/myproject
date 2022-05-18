class Api::UsersController < ApplicationController

   before_action :require_current_user!, except: [:create]

    def create
        @user = User.new(user_params)

        begin
            user_saved_successfully = @user.save
        rescue ActiveRecord::RecordNotUnique
            # add duplicate username message to username errors list
            user_saved_successfully = false
            @user.errors.messages[:username].append("already exists")
        end

        if user_saved_successfully
            login!(@user)
            render :show
        else
            render json: {user: nil, errors: @user.errors.messages}
        end
    end

    private
    # param helper
    def user_params
        params.require(:user).permit(:username, :password)
    end

end
