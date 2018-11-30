# frozen_string_literal: true

require 'phantomjs'

class NoteContentCleaner
  def initialize(note)
    @note = note
  end

  def run!
    file = Tempfile.new('mykonote_cleanup')
    file.write(@note.content)
    file.close

    @note.update!(content: content(file))

    file.unlink
  end

  private

  def content(file)
    Phantomjs.run(script_path, file.path).strip
  end

  def script_path
    Rails.root.join(
      'app', 'assets', 'javascripts', 'phantomjs', 'quill_format.js'
    ).to_s
  end
end
