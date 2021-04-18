# frozen_string_literal: true

class AddTasksToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :tasks, :jsonb
    add_index :notes, :tasks, using: 'gin'
  end
end
