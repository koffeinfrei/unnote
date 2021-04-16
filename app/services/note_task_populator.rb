# frozen_string_literal: true

class NoteTaskPopulator
  def initialize(note)
    @note = note
  end

  def run
    html = Nokogiri::HTML::DocumentFragment.parse(@note.content)

    todo = html.css('ul.task-list li:not(.checked)').map do |checkbox|
      build_task!(checkbox)
    end

    done = html.css('ul.task-list li.checked').map do |checkbox|
      build_task!(checkbox)
    end

    # save_with -> don't add newlines, it will break quill
    @note.content = html.to_html(save_with: 0)
    @note.tasks = { todo: todo, done: done }
  end

  private

  def build_task!(checkbox)
    id = checkbox['data-task-id'] || SecureRandom.uuid[/^[^-]+/]
    checkbox['data-task-id'] = id

    { id => checkbox.content }
  end
end
