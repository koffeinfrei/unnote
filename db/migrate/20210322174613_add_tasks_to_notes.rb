# frozen_string_literal: true

class AddTasksToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :tasks, :json
  end
end
