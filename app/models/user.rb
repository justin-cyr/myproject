class User < ApplicationRecord

    # this generates a getter for the password attribute
    attr_reader :password

    validates :username, :password_hash, :session_token, presence: true
    validates :password, length: {minimum: 6, allow_nil: true}

    before_validation :ensure_session_token

    # public class methods

    def self.find_by_credentials(username, password)
        # Return User object for username if it exists and password matches saved password_hash, else return nil.
        user = User.find_by(username: username)

        # if username not found
        return nil if user.nil?

        # else check password
        user.is_password?(password) ? user : nil
    end


    # Session token generator
    def self.generate_session_token
        SecureRandom::urlsafe_base64(16)
    end


    # public instance methods

    # Password encryption
    # Ruby setter for password attribute
    def password=(password)
        @password = password
        self.password_hash = BCrypt::Password.create(@password)
    end


    # Password verification
    def is_password?(password)
        BCrypt::Password.new(self.password_hash).is_password?(password)
    end


    # Reset session token
    def reset_session_token!
        self.session_token = User.generate_session_token
        self.save!
        self.session_token
    end


    private 

    def ensure_session_token
        self.session_token ||= User.generate_session_token
    end

end
