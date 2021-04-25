# frozen_string_literal: true

class PopulateNotesTasksData < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  # rubocop:disable Metrics/MethodLength
  def up
    transaction do
      # don't update updated_at
      ActiveRecord::Base.record_timestamps = false
      begin
        Note.find_each do |note|
          before = note.text_content

          note.save!

          # the new attribute `data-task-id` should be the only difference
          after = note.reload.text_content.gsub(/ data-task-id="[^"]+"/, '')

          if before != after
            raise 'Content after populating the tasks from the content has changed! Aborting.' \
              "\n***\nbefore:\n#{before}\n\nafter:\n#{after}\n***"
          end
        end
      ensure
        ActiveRecord::Base.record_timestamps = true
      end
    end
  end
  # rubocop:enable Metrics/MethodLength

  def down
    # no-op
  end
end
