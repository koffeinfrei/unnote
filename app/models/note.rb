class Note < ActiveRecord::Base
  include PgSearch
  pg_search_scope(
    :search_by_title_and_content,
    against: {
      title: 'A',
      content: 'B'
    },
    using: {
      tsearch: {
        prefix: true,
        tsvector_column: [:tsv_title, :tsv_content]
      }
    }
  )

  belongs_to :user

  scope :default_ordered, -> { order(updated_at: :desc) }

  def to_param
    uid
  end
end
