class Game < ActiveRecord::Base
  has_many :players
  
  def self.authenticate(id, password)
    game = Game.find(id)
    if game.blank? || password != game.password
      return nil
    else
      return game
    end
  end
  
  def other_player(this_player)
    (self.players - [this_player]).first
  end
end

# == Schema Information
#
# Table name: games
#
#  id         :integer         not null, primary key
#  password   :string(255)
#  whose_turn :integer
#

