class AddSessionPasswordColumn < ActiveRecord::Migration
  def self.up
    add_column "sessions", "password", :string
  end

  def self.down
    remove_column "sessions", "password"
  end
end
