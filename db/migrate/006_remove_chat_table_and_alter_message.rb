class RemoveChatTableAndAlterMessage < ActiveRecord::Migration
  def self.up
    drop_table :chats
    remove_column :messages, :chat_id
    add_column :messages, :session_id, :integer
  end

  def self.down
    create_table :chats do |t|
      t.column :session_id, :integer, :null => false
    end
    add_column :messages, :chat_id,   :integer, :null => false
    remove_column :messages, :session_id
  end
end
