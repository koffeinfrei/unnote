class AddUidToNotes < ActiveRecord::Migration[4.2]
  def change
    add_column :notes, :uid, :uuid, null: false
  end
end
