# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_03_22_175726) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "notes", id: :serial, force: :cascade do |t|
    t.string "title"
    t.text "text_content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uid", null: false
    t.integer "user_id"
    t.tsvector "tsv_title"
    t.tsvector "tsv_content"
    t.string "images", default: [], array: true
    t.datetime "archived_at"
    t.jsonb "tasks"
    t.index ["archived_at"], name: "index_notes_on_archived_at"
    t.index ["tasks"], name: "index_notes_on_tasks", using: :gin
    t.index ["tsv_content"], name: "index_notes_on_tsv_content", using: :gin
    t.index ["tsv_title"], name: "index_notes_on_tsv_title", using: :gin
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "subscription", default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "versions", id: :serial, force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.json "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "notes", "users"
end
