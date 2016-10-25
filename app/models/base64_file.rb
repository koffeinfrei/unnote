class Base64File
  def initialize(file)
    @file = file
  end

  def filename_without_extension
    File.basename(@file.original_filename, File.extname(@file.original_filename))
  end

  def data_url
    base64 = Base64.strict_encode64(@file.read)
    "data:#{@file.content_type};base64,#{base64}"
  end
end
