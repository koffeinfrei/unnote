# frozen_string_literal: true

class AddUidToNotes < ActiveRecord::Migration[4.2]
  def change
    add_column(
      :notes,
      :uid, :uuid,
      null: false,
      default: '00000000-0000-0000-0000-000000000000'
    )
  end
end
