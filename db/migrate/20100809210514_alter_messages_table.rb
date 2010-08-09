class AlterMessagesTable < ActiveRecord::Migration
  def self.up
    rename_column :messages, :session_id, :game_id
  end

  def self.down
    rename_column :messages, :game_id, :session_id
  end
end
