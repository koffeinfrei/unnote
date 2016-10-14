require 'rails_helper'

RSpec.describe Note do
  describe '#content' do
    context 'content contains 1 image' do
      let(:note) do
        Note.create!(
          uid: SecureRandom.uuid,
          content: 'content1 <img src="data:image/png;base64,iVBORw0KGgo" />'
        )
      end

      after { note.remove_images! }

      it 'saves an image as a file' do
        expect(note.images.count).to eq 1
        expect(note.images.first.file).to exist
      end

      it 'replaces the base64 part with the file hash' do
        expect(note.text_content).to eq(
          'content1 <img src="f6b53b9032376ac7ecb4b999093cb965963f37b6511587dd10ca52c295fe33e2" />'
        )
      end

      it 'adds one image and removes one' do
        note.update_attributes!(
          content:
          'content1 <img src="data:image/png;base64,iVBORw0KGgo" />' \
          'content2 <img src="data:image/png;base64,NSUhEUgAAA0" />'
        )

        first_file = note.images[0].file
        second_file = note.images[1].file

        expect(note.images.count).to eq 2
        expect(first_file).to exist
        expect(second_file).to exist

        note.update_attributes!(
          content:
          'content2 <img src="data:image/png;base64,NSUhEUgAAA0" />'
        )

        expect(note.images.count).to eq 1
        expect(first_file).not_to exist
        expect(second_file).to exist
      end
    end
  end
end
