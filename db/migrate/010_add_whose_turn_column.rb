class AddWhoseTurnColumn < ActiveRecord::Migration
  def self.up
    add_column "sessions", "whose_turn", :integer
  end

  def self.down
    remove_column "sessions", "whose_turn"
  end
end
