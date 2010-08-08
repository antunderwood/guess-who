class AddUpdatedAndLoggedInColums < ActiveRecord::Migration
  def self.up
    add_column :players, :logged_in, :integer
    add_column :players, :updated_at, :timestamp
  end

  def self.down
    remove_column :players, :logged_in
    remove_column :players, :updated_at
  end
end
