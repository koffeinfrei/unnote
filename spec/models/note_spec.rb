require 'rails_helper'

RSpec.describe Note do
  describe '#content' do
    context 'content contains 1 image' do
      let(:note) do
        Note.create!(
          uid: SecureRandom.uuid,
          content: 'content1 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />'
        )
      end

      after { note.remove_images! }

      it 'saves an image as a file' do
        expect(note.images.count).to eq 1
        expect(note.images.first.file).to exist
      end

      it 'replaces the base64 part with the file hash' do
        expect(note.text_content).to eq(
          'content1 <img src="360593ff547c864bd9d16bbed6eb8860d9fad9a407aa74e066039db23b525338" />'
        )
      end

      it 'adds one image and removes one' do
        note.update_attributes!(
          content:
          'content1 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />' \
          'content2 <img src="data:image/png;base64,/8c/4AAQSkZJRgABAQEASABKdhH//2Q=" />'
        )

        first_file = note.images[0].file
        second_file = note.images[1].file

        expect(note.images.count).to eq 2
        expect(first_file).to exist
        expect(second_file).to exist

        note.update_attributes!(
          content:
          'content2 <img src="data:image/png;base64,/8c/4AAQSkZJRgABAQEASABKdhH//2Q=" />'
        )

        expect(note.images.count).to eq 1
        expect(first_file).not_to exist
        expect(second_file).to exist
      end
    end
  end
end
