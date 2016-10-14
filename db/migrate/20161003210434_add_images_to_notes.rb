class AddImagesToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :images, :string, array: true, default: []
  end
end
