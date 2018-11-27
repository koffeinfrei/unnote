require 'rails_helper'

RSpec.describe Note do
  describe '#content=' do
    context 'content contains 1 image' do
      let(:note) do
        Note.create!(
          uid: SecureRandom.uuid,
          user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'),
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

    it 'saves equal images as one file' do
      note = Note.create!(
        uid: SecureRandom.uuid,
        user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'),
        content:
        'content1 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />' \
        'content2 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />'
      )

      expect(note.images.count).to eq 1
      expect(note.images[0].file).to exist
    end
  end

  describe '#content' do
    it 'retrieves equal images from one file' do
      note = Note.create!(
        uid: SecureRandom.uuid,
        user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'),
        content:
        'content1 <img src="360593ff547c864bd9d16bbed6eb8860d9fad9a407aa74e066039db23b525338" />' \
        'content2 <img src="360593ff547c864bd9d16bbed6eb8860d9fad9a407aa74e066039db23b525338" />',
        images: [Base64StringIO.new("data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=")]
      )

      expect(note.content).to eq(
        'content1 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />' \
        'content2 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />' \
      )
    end
  end

  describe '#dup' do
    it 'duplicates the images' do
      note = Note.create!(
        uid: SecureRandom.uuid,
        user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'),
        content:
        'content1 <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q=" />' \
        'content2 <img src="data:image/png;base64,/9j/5AAQSkZJRgABAQEASABKdhH//2Q=" />',
      )

      dup_note = note.dup
      dup_note.save!

      expect(dup_note.images.count).to eq 2
      expect(dup_note.images.first.file).to exist
      expect(dup_note.images.last.file).to exist

      note.remove_images!
      dup_note.remove_images!
    end

    it 'generates a new uuid' do
      note = Note.create!(
        uid: SecureRandom.uuid,
        user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf')
      )

      dup_note = note.dup
      dup_note.save!

      expect(dup_note.uid).not_to eq note.uid
    end
  end

  describe '#archive!' do
    it 'sets the archived_at timestamp' do
      now = Time.local(2016, 8, 1, 15, 33)

      Timecop.freeze(now) do
        note = Note.create!(
          uid: SecureRandom.uuid,
          user: User.create!(email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf')
        )

        note.archive!

        expect(note.archived_at).to eq now
      end
    end
  end

  describe '.archived' do
    it 'returns only the archived note' do
      user = User.create!(
        email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'
      )
      archived = Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        archived_at: Time.local(2016, 8, 1, 15, 33)
      )

      Note.create!(
        uid: SecureRandom.uuid,
        user: user
      )

      expect(Note.archived).to eq [archived]
    end
  end

  describe '.unarchived' do
    it 'returns only the unarchived note' do
      user = User.create!(
        email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf'
      )
      Note.create!(
        uid: SecureRandom.uuid,
        user: user,
        archived_at: Time.local(2016, 8, 1, 15, 33)
      )

      unarchived = Note.create!(
        uid: SecureRandom.uuid,
        user: user
      )

      expect(Note.unarchived).to eq [unarchived]
    end
  end

  describe 'validation: does_not_exceed_free_count_limit' do
    context 'pro subscription' do
      let(:user) { User.create! email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf', subscription: :pro }

      it 'allows unlimited notes' do
        stub_const('Note::FREE_COUNT_LIMIT', 1)
        Note.create! title: 'my_note', user: user, uid: SecureRandom.uuid

        note = Note.create title: 'my_note', user: user, uid: SecureRandom.uuid

        expect(note).to be_persisted
      end

      it 'does not invoke the callback' do
        note = Note.new title: 'my_note', user: user, uid: SecureRandom.uuid

        expect(note).not_to receive(:does_not_exceed_free_count_limit)

        note.save!
      end
    end

    context 'free subscription' do
      let(:user) { User.create! email: 'user@example.com', password: 'asdfasdf', password_confirmation: 'asdfasdf', subscription: :free }

      it 'fails validation when limit is exceeded' do
        stub_const('Note::FREE_COUNT_LIMIT', 1)
        Note.create! title: 'my_note', user: user, uid: SecureRandom.uuid

        note = Note.create title: 'my_note', user: user, uid: SecureRandom.uuid

        expect(note).not_to be_persisted
        expect(note.errors[:base]).to eq [
          'You have reached your note limit of 1 notes. Please delete some notes or upgrade your subscription.'
        ]
      end
    end
  end
end
