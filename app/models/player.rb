# == Schema Information
#
# Table name: players
#
#  id            :integer         not null, primary key
#  session_id    :integer         not null
#  player_number :integer
#  name          :string(255)
#  logged_in     :integer
#  updated_at    :datetime
#  chosen_card   :integer
#
class Player < ActiveRecord::Base
  belongs_to :game
  has_many :messages
end



