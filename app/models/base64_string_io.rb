# frozen_string_literal: true

# initially taken from
# https://github.com/lebedev-yury/carrierwave-base64/blob/master/lib/carrierwave/base64/base64_string_io.rb
class Base64StringIO < StringIO
  class ArgumentError < StandardError; end

  attr_accessor :file_format, :file_name

  # @param [String] encoded_file e.g.
  #   "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=="
  def initialize(encoded_file)
    description, encoded_bytes = encoded_file.split(',')

    raise ArgumentError unless encoded_bytes
    raise ArgumentError if encoded_bytes == '(null)'

    @file_name = Digest::SHA256.hexdigest(encoded_file)
    @file_format = get_file_format(description)
    bytes = Base64.strict_decode64(encoded_bytes)

    super(bytes)
  end

  def original_filename
    File.basename("#{@file_name}.#{@file_format}")
  end

  private

  def get_file_format(description)
    regex = /([a-z0-9]+);base64\z/
    regex.match(description).try(:[], 1)
  end
end
