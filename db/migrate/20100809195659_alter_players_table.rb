class AlterPlayersTable < ActiveRecord::Migration
  def self.up
    rename_column :players, :session_id, :game_id
    add_column :players, :last_message_displayed, :integer, :default => 0
  end

  def self.down
    remove_column :players, :last_message_displayed
    rename_column :players, :game_id, :session_id
  end
end
