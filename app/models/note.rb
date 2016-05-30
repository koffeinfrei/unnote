class Note < ActiveRecord::Base
  scope :default_ordered, -> { order(created_at: :desc) }

  def to_param
    uid
  end
end
