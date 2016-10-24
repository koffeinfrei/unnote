class NoteContentCleaner
  def initialize(note)
    @note = note
  end

  def run
    file = Tempfile.new('mykonote_cleanup')
    file.write(@note.text_content)
    file.close

    content = Phantomjs.run(
      Rails.root.join('app/assets/javascripts/phantomjs/quill_format.js').to_s,
      file.path
    ).strip

    file.unlink

    content
  end
end
