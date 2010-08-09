class ChangeSessionTableToGame < ActiveRecord::Migration
  def self.up
    rename_table :sessions, :games
  end

  def self.down
    rename_table :games, :session
  end
end
