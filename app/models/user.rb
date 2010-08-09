class User < ActiveRecord::Base
  def password=(pass) 
    salt = [Array.new(6){rand(256).chr}.join].pack("m").chomp 
    self.password_salt, self.password_hash = 
    salt, Digest::SHA256.hexdigest(pass + salt) 
  end
end

class User < ActiveRecord::Base
  validates_uniqueness_of :username
  require 'digest/sha2'
  def self.authenticate(username, password)
    user = User.find(:first, :conditions => ['username = ?', username])
    if user.blank? || Digest::SHA256.hexdigest(password + user.password_salt) != user.password_hash
      id = 0
    else
      id = user.id
    end
    id
  end
end


# == Schema Information
#
# Table name: users
#
#  id            :integer         not null, primary key
#  username      :string(255)
#  password_salt :string(255)
#  password_hash :string(255)
#

