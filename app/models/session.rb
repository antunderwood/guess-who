class Session < ActiveRecord::Base
  has_many :players
  has_one :chat
  
  def self.authenticate(id, password)
    session = Session.find(id)
    if session.blank? || password != session.password
      id = 0
    else
      id = session.id
    end
    id
  end
end
