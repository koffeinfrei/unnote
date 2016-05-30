class AddUidToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :uid, :uuid, null: false
  end
end
