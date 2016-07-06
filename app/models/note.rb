class Note < ActiveRecord::Base
  include PgSearch
  pg_search_scope(
    :search_by_title_and_content,
    against: {
      tsv_title: 'A',
      tsv_content: 'B'
    },
    using: { tsearch: { prefix: true } }
  )

  belongs_to :user

  scope :default_ordered, -> { order(updated_at: :desc) }

  def to_param
    uid
  end
end
