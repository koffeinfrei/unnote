class Note < ActiveRecord::Base
  include PgSearch
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

  belongs_to :user

  scope :default_ordered, -> { order(updated_at: :desc) }

  def content=(content)
    matches = content.scan(/<img.*? src=['"](data:image\/[^;]+;base64,[^'"]+)['"].*?>/).flatten

    files = matches.map do |match|
      file_name = Digest::SHA256.hexdigest(match)
      content.sub!(match, file_name)
      Base64StringIO.new(match, file_name)
    end

    new_file_names = files.map(&:original_filename)

    # remove obsolete images
    images.select { |image| !new_file_names.include?(image.file.original_filename) }.each do |image|
      self.images.delete(image)
      image.remove!
    end

    # add new ones
    old_file_names = images.map(&:file).map(&:original_filename)
    files.select { |image| !old_file_names.include?(image.original_filename) }.each do |image|
      self.images += [image]
    end

    # FIXME: https://github.com/carrierwaveuploader/carrierwave/issues/1990
    self[:images] = images.map(&:file).map(&:original_filename)

    self.text_content = content
  end

  def content
    content = self.text_content.dup

    images.map do |image|
      image_id = File.basename(image.file.original_filename, File.extname(image.file.original_filename))
      base64 = Base64.encode64(image.file.read)
      data_url = "data:#{image.file.content_type};base64,#{base64}"

      content.sub!(/(<img.*? src=['"])(#{image_id})(['"].*?>)/, "\\1#{data_url}\\3")
    end

    content
  end

  def to_param
    uid
  end

  def as_json(options={})
    super(only: [:uid, :title, :created_at, :updated_at]).merge(content: content)
  end
end
