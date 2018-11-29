# frozen_string_literal: true

class AddImagesToNotes < ActiveRecord::Migration[4.2]
  def change
    add_column :notes, :images, :string, array: true, default: []
  end
end
