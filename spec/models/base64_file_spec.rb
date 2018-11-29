# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Base64File do
  subject(:base64_file) { described_class.new(file) }

  let(:file) { instance_double(CarrierWave::SanitizedFile, original_filename: 'rainbow.jpg') }

  describe '#filename_without_extension' do
    it 'returns the filename without the extension' do
      expect(base64_file.filename_without_extension).to eq 'rainbow'
    end
  end

  describe '#data_url' do
    it 'returns the base64 encoded data url' do
      allow(file).to receive(:read).and_return(
        "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00Jv\x11\xFF\xFFd"
      )
      allow(file).to receive(:content_type).and_return('image/jpg')

      expect(base64_file.data_url).to eq 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q='
    end
  end
end
