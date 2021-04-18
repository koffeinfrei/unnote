# frozen_string_literal: true

class Note < ApplicationRecord
  FREE_COUNT_LIMIT = 100

  include CarrierWave::Base64ImageContent
  include PgSearch::Model

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
        tsvector_column: %i[tsv_title tsv_content]
      }
    }
  )

  has_paper_trail skip: %i[tsv_title tsv_content]

  mount_uploaders :images, ImageUploader

  base64_image_content content: :text_content, images: :images

  scope :default_ordered, -> { order(updated_at: :desc) }

  scope :archived, -> { where.not(archived_at: nil) }
  scope :unarchived, -> { where(archived_at: nil) }

  scope :having_todo_tasks, -> { where(%(tasks @> '[{ "done": false }]')) }
  scope :having_done_tasks, -> { where(%(tasks @> '[{ "done": true }]')) }
  scope :having_tasks, -> { having_todo_tasks.or(having_done_tasks) }

  validate(
    :does_not_exceed_free_count_limit,
    on: :create,
    if: ->(note) { note.user.free? }
  )

  before_save :populate_tasks

  def to_param
    uid
  end

  def as_json(options = {})
    only = options.fetch(
      :only,
      %i[uid title created_at updated_at archived_at content tasks]
    ).map(&:to_s)
    options = { only: only }.merge(options)

    # use the actual content (see `HasContent`)
    json = super(options).merge('content' => content)

    # we need to slice again for `content` to be considered as well
    json.slice(*only)
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
    return if user.notes.count < FREE_COUNT_LIMIT

    errors.add(
      :base,
      "You have reached your note limit of #{FREE_COUNT_LIMIT} notes. " \
      'Please delete some notes or upgrade your subscription.'
    )
  end

  def populate_tasks
    NoteTaskPopulator.new(self).run
  end
end
