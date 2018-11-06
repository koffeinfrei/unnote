class ExtractContentImagesToFiles < ActiveRecord::Migration[4.2]
  def change
    # don't update updated_at
    ActiveRecord::Base.record_timestamps = false
    begin
      Note.find_each do |note|
        note.update_attributes!(content: note.content)
      end
    ensure
      ActiveRecord::Base.record_timestamps = true
    end
  end
end
