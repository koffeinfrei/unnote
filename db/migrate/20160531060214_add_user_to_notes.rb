class AddUserToNotes < ActiveRecord::Migration
  def change
    add_reference :notes, :user, index: true, foreign_key: true
  end
end
