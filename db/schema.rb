# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 11) do

  create_table "messages", :force => true do |t|
    t.integer "player_id",    :null => false
    t.text    "content"
    t.integer "session_id"
    t.string  "message_type"
  end

  create_table "players", :force => true do |t|
    t.integer  "session_id",    :null => false
    t.integer  "player_number"
    t.string   "name"
    t.integer  "logged_in"
    t.datetime "updated_at"
    t.integer  "chosen_card"
  end

  create_table "sessions", :force => true do |t|
    t.string  "password"
    t.integer "whose_turn"
  end

  create_table "users", :force => true do |t|
    t.string "username"
    t.string "password_salt"
    t.string "password_hash"
  end

end