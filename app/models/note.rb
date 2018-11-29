# frozen_string_literal: true

class Note < ApplicationRecord
  FREE_COUNT_LIMIT = 100

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

  scope :archived, -> { where.not(archived_at: nil) }
  scope :unarchived, -> { where(archived_at: nil) }

  validate(
    :does_not_exceed_free_count_limit,
    on: :create,
    if: ->(note) { note.user.free? }
  )

  def to_param
    uid
  end

  def as_json(_options = {})
    super(only: [:uid, :title, :created_at, :updated_at, :archived_at]).merge(content: content)
  end

  def dup
    super.tap do |dup_note|
      dup_note.uid = SecureRandom.uuid

      dup_note.images = images.map do |image|
        File.open(image.file.file)
      end
    end
  end

  def archive!
    update!(archived_at: Time.zone.now)
  end

  private

  def does_not_exceed_free_count_limit
    if user.notes.count >= FREE_COUNT_LIMIT
      errors.add(
        :base,
        "You have reached your note limit of #{FREE_COUNT_LIMIT} notes. " \
        "Please delete some notes or upgrade your subscription."
      )
    end
  end
end
