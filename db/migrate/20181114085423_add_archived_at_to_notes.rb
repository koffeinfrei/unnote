class AddArchivedAtToNotes < ActiveRecord::Migration[5.2]
  def change
    add_column :notes, :archived_at, :datetime
    add_index :notes, :archived_at
  end
end
