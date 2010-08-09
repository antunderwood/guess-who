require File.dirname(__FILE__) + '/../test_helper'

class MessageTest < Test::Unit::TestCase
  fixtures :messages

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end

# == Schema Information
#
# Table name: messages
#
#  id           :integer         not null, primary key
#  player_id    :integer         not null
#  content      :text
#  session_id   :integer
#  message_type :string(255)
#

