class Note < ApplicationRecord
  include HasContent
  include PgSearch

  belongs_to :user

  pg_search_scope(
    :search_by_title_and_content,
    against: {
      title: 'A',
      text_content: 'B'
    },
    using: {
      tsearch: {
        prefix: true,
        tsvector_column: [:tsv_title, :tsv_content]
      }
    }
  )

  has_paper_trail skip: [:tsv_title, :tsv_content]

  mount_uploaders :images, ImageUploader

  scope :default_ordered, -> { order(updated_at: :desc) }

  def to_param
    uid
  end

  def as_json(options={})
    super(only: [:uid, :title, :created_at, :updated_at]).merge(content: content)
  end

  def dup
    super.tap do |dup_note|
      dup_note.uid = SecureRandom.uuid

      dup_note.images = images.map do |image|
        File.open(image.file.file)
      end
    end
  end
end
