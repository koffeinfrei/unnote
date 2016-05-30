class Note < ActiveRecord::Base
  include PgSearch
  pg_search_scope(
    :search_by_title_and_content,
    against: {
      title: 'A',
      content: 'B'
    },
    using: { tsearch: { prefix: true } }
  )

  scope :default_ordered, -> { order(created_at: :desc) }

  def to_param
    uid
  end
end
