class AlterPlayersTable < ActiveRecord::Migration
  def self.up
    rename_column :players, :session_id, :game_id
    add_column :players, :last_message_displayed, :integer
  end

  def self.down
    remove_column :players, :last_message_displayed
    rename_column :players, :game_id
    mcol, :session_id
  end
end
