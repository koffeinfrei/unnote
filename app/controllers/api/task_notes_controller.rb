# frozen_string_literal: true

module Api
  class TaskNotesController < NotesController
    before_action :add_filters, only: :index

    private

    def add_filters
      params[:filters] = (params[:filters] || []) + ['tasks']
    end
  end
end
