# frozen_string_literal: true

class NoteTaskPopulator
  def initialize(note)
    @note = note
  end

  def run
    html = Nokogiri::HTML::DocumentFragment.parse(@note.text_content)

    @note.tasks = html.css('ul.task-list li').map do |checkbox|
      build_task!(checkbox)
    end

    # save_with -> don't add newlines, it will break quill
    @note.text_content = html.to_html(save_with: 0)
  end

  private

  def build_task!(checkbox)
    id = checkbox['data-task-id'] || SecureRandom.uuid[/^[^-]+/]
    checkbox['data-task-id'] = id

    {
      id: id,
      title: checkbox.content,
      done: checkbox['class'].to_s.include?('checked')
    }
  end
end
