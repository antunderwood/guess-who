require File.dirname(__FILE__) + '/../test_helper'

class PlayerTest < Test::Unit::TestCase
  fixtures :players

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end

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

