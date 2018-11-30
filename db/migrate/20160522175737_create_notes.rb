# frozen_string_literal: true

class CreateNotes < ActiveRecord::Migration[4.2]
  def change
    create_table :notes do |t|
      t.string :title
      t.text :content

      t.timestamps null: false
    end
  end
end
