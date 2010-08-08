class AddChosenCardToPlayersTable < ActiveRecord::Migration
  def self.up
    add_column "players", "chosen_card", :integer
  end

  def self.down
    remove_column "players", "chosen_card"
  end
end
