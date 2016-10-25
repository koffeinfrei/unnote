namespace :data do
  namespace :format do
    desc 'Formats the html content of all notes such that it is quill compatible'
    task all: :environment do
      ActiveRecord::Base.record_timestamps = false
      begin
        Note.find_each do |note|
          content = NoteContentCleaner.new(note).run
          note.update_attributes!(text_content: content)
        end
      ensure
        ActiveRecord::Base.record_timestamps = true
      end
    end
  end
end
