# frozen_string_literal: true

class NotesFinder
  def initialize(user, params = {})
    @user = user
    @params = params
  end

  def call
    @notes = user_scoped_notes

    search!
    filter!
    order!
    limit!

    @notes
  end

  def current_page
    (@params[:page].presence || 1).to_i
  end

  def more_pages?
    @notes.page(current_page).next_page.present?
  end

  private

  def user_scoped_notes
    NotePolicy::Scope.new(@user, Note.unarchived).resolve
  end

  def search!
    return if @params[:search].blank?

    @notes = @notes.search_by_title_and_content(@params[:search])
  end

  def filter!
    return if @params[:filters].blank?

    if @params[:filters].include?('tasks') && @params[:filters].include?('todo')
      @notes = @notes.having_todo_tasks
    elsif @params[:filters].include?('tasks')
      @notes = @notes.having_tasks
    end
  end

  def order!
    @notes = @notes.default_ordered
  end

  def limit!
    @notes = @notes.limit(current_page * Kaminari.config.default_per_page)
  end
end
