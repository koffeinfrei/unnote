class Note < ActiveRecord::Base
  scope :default_ordered, -> { order(created_at: :desc) }
end
