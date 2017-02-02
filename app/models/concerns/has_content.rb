module HasContent
  extend ActiveSupport::Concern

  def content=(content)
    new_image_files = extract_image_files_from_content(content)

    remove_obsolete_files!(new_image_files)
    add_new_files!(new_image_files)

    # FIXME: https://github.com/carrierwaveuploader/carrierwave/issues/1990
    self[:images] = images.map(&:file).map(&:original_filename)

    self.text_content = content
  end

  def content
    return unless text_content

    content = text_content.dup

    images.map do |image|
      base64_file = Base64File.new(image.file)
      content.gsub!(
        /(<img.*? src=['"])(#{base64_file.filename_without_extension})(['"].*?>)/,
        "\\1#{base64_file.data_url}\\3"
      )
    end

    content
  end

  private

  def extract_image_files_from_content(content)
    matches = content
      .scan(/<img.*? src=['"](data:image\/[^;]+;base64,[^'"]+)['"].*?>/)
      .flatten

    matches.uniq.map do |match|
      Base64StringIO.new(match).tap do |file|
        content.sub!(match, file.file_name)
      end
    end
  end

  def remove_obsolete_files!(new_image_files)
    new_file_names = new_image_files.map(&:original_filename)

    images
      .select { |image| !new_file_names.include?(image.file.original_filename) }
      .each do |image|
        images.delete(image)
        image.remove!
      end
  end

  def add_new_files!(new_image_files)
    old_file_names = images.map(&:file).map(&:original_filename)

    new_image_files
      .select { |image| !old_file_names.include?(image.original_filename) }
      .each do |image|
        self.images += [image]
      end
  end
end
