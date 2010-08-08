class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.column :player_id, :integer, :null => false
      t.column :chat_id, :integer, :null => false
      t.column :content, :text
    end
  end

  def self.down
    drop_table :messages
  end
end
