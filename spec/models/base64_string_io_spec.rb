require 'rails_helper'

# initially taken from
# https://github.com/lebedev-yury/carrierwave-base64/blob/master/lib/carrierwave/base64/base64_string_io.rb
RSpec.describe Base64StringIO do
  context 'correct "image/jpg" data' do
    let(:data) do
      'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q='
    end

    subject { Base64StringIO.new(data) }

    it 'determines the file format from the Data URI content type' do
      expect(subject.file_format).to eql 'jpg'
    end

    it 'should respond to :original_filename' do
      expect(subject.original_filename).to eql 'b729cadfd5b337f7a0c88a4bba48454cdd0ac59ff909da4cb8bdcd57b3cacb2e.jpg'
    end
  end

  context 'invalid image data' do
    it 'raises an ArgumentError if the data uri content type is missing' do
      expect do
        Base64StringIO.new('/9j/4AAQSkZJRgABAQEASABIAADKdhH//2Q=')
      end.to raise_error(Base64StringIO::ArgumentError)
    end

    it 'raises ArgumentError if base64 data equals (null)' do
      expect do
        Base64StringIO.new('data:image/jpg;base64,(null)')
      end.to raise_error(Base64StringIO::ArgumentError)
    end
  end
end
