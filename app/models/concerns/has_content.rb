module HasContent
  extend ActiveSupport::Concern

  def content=(content)
    matches = content.scan(/<img.*? src=['"](data:image\/[^;]+;base64,[^'"]+)['"].*?>/).flatten

    files = matches.map do |match|
      Base64StringIO.new(match).tap do |file|
        content.sub!(match, file.file_name)
      end
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
      base64_file = Base64File.new(image.file)
      content.sub!(
        /(<img.*? src=['"])(#{base64_file.filename_without_extension})(['"].*?>)/,
        "\\1#{base64_file.data_url}\\3"
      )
    end

    content
  end
end
