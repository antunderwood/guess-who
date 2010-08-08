class CreateChats < ActiveRecord::Migration
  def self.up
    create_table :chats do |t|
      t.column :session_id, :integer, :null => false
    end
  end

  def self.down
    drop_table :chats
  end
end
