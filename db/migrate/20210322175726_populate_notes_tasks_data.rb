# frozen_string_literal: true

class PopulateNotesTasksData < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def up
    transaction do
      # don't update updated_at
      ActiveRecord::Base.record_timestamps = false
      begin
        Note.find_each(&:save!)
      ensure
        ActiveRecord::Base.record_timestamps = true
      end
    end
  end

  def down
    # no-op
  end
end
