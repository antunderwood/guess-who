class CreatePlayers < ActiveRecord::Migration
  def self.up
    create_table :players do |t|
      t.column :session_id, :integer, :null => false
      t.column :player_number, :integer
      t.column :name, :string
    end
  end

  def self.down
    drop_table :players
  end
end
