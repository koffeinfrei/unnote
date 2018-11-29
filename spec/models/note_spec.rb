# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Note do
  let(:image1_placeholder) do
    '360593ff547c864bd9d16bbed6eb8860d9fad9a407aa74e066039db23b525338'
  end

  let(:image1_data) do
    'data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q='
  end

  let(:image2_data) do
    'data:image/png;base64,/8c/4AAQSkZJRgABAQEASABKdhH//2Q='
  end

  describe '#content=' do
    context 'when content contains 1 image' do
      let(:note) do
        described_class.create!(
          uid: SecureRandom.uuid,
          user: create_user,
          content: %(content1 <img src="#{image1_data}" />)
        )
      end

      after { note.remove_images! }

      it 'saves an image as a file' do
        expect(note.images.count).to eq 1
        expect(note.images.first.file).to exist
      end

      it 'replaces the base64 part with the file hash' do
        expect(note.text_content).to eq(
          %(content1 <img src="#{image1_placeholder}" />)
        )
      end

      it 'adds one image and removes one' do
        note.update!(
          content:
            %(content1 <img src="#{image1_data}" />) +
            %(content2 <img src="#{image2_data}" />)
        )

        first_file = note.images[0].file
        second_file = note.images[1].file

        expect(note.images.count).to eq 2
        expect(first_file).to exist
        expect(second_file).to exist

        note.update!(
          content: %(content2 <img src="#{image2_data}" />)
        )

        expect(note.images.count).to eq 1
        expect(first_file).not_to exist
        expect(second_file).to exist
      end
    end

    it 'saves equal images as one file' do
      note = described_class.create!(
        uid: SecureRandom.uuid,
        user: create_user,
        content:
          %(content1 <img src="#{image1_data}" />) +
          %(content2 <img src="#{image1_data}" />)
      )

      expect(note.images.count).to eq 1
      expect(note.images[0].file).to exist
    end
  end

  describe '#content' do
    it 'retrieves equal images from one file' do
      note = described_class.create!(
        uid: SecureRandom.uuid,
        user: create_user,
        content:
          %(content1 <img src="#{image1_placeholder}" />) +
          %(content2 <img src="#{image1_placeholder}" />),
        images: [Base64StringIO.new(image1_data)]
      )

      expect(note.content).to eq(
        %(content1 <img src="#{image1_data}" />) +
        %(content2 <img src="#{image1_data}" />)
      )
    end
  end

  describe '#as_json' do
    context 'when no options provided' do
      it 'returns the whitelisted attributes' do
        note = described_class.new(
          uid: '78428484-e602-4e27-8fea-0c4e79f74c5b',
          title: 'note 1',
          content: 'content 1',
          created_at: Time.zone.local(2016, 8, 1, 15, 33),
          updated_at: Time.zone.local(2016, 8, 1, 15, 33),
          archived_at: nil
        )

        expect(note.as_json).to eq(
          {
            uid: '78428484-e602-4e27-8fea-0c4e79f74c5b',
            title: 'note 1',
            content: 'content 1',
            created_at: Time.zone.local(2016, 8, 1, 15, 33),
            updated_at: Time.zone.local(2016, 8, 1, 15, 33),
            archived_at: nil
          }.stringify_keys
        )
      end
    end

    context 'when :only option provided' do
      let(:note) do
        described_class.new(
          uid: '78428484-e602-4e27-8fea-0c4e79f74c5b',
          title: 'note 1',
          content: 'content 1',
          created_at: Time.zone.local(2016, 8, 1, 15, 33),
          updated_at: Time.zone.local(2016, 8, 1, 15, 33),
          archived_at: nil
        )
      end

      it 'returns only the requested uid and content attributes' do
        json = note.as_json(only: %i[uid content])

        expect(json).to eq(
          {
            uid: '78428484-e602-4e27-8fea-0c4e79f74c5b',
            content: 'content 1'
          }.stringify_keys
        )
      end

      it 'returns only the requested uid attribute' do
        json = note.as_json(only: [:uid])

        expect(json).to eq(
          {
            uid: '78428484-e602-4e27-8fea-0c4e79f74c5b'
          }.stringify_keys
        )
      end

      it 'returns only the requested content attribute' do
        json = note.as_json(only: [:content])

        expect(json).to eq(
          {
            content: 'content 1'
          }.stringify_keys
        )
      end
    end
  end

  describe '#dup' do
    it 'duplicates the images' do
      note = described_class.create!(
        uid: SecureRandom.uuid,
        user: create_user,
        content:
          %(content1 <img src="#{image1_data}" />) +
          %(content2 <img src="#{image2_data}" />)
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
      note = described_class.create!(
        uid: SecureRandom.uuid,
        user: create_user
      )

      dup_note = note.dup
      dup_note.save!

      expect(dup_note.uid).not_to eq note.uid
    end
  end

  describe '#archive!' do
    it 'sets the archived_at timestamp' do
      now = Time.zone.local(2016, 8, 1, 15, 33)

      Timecop.freeze(now) do
        note = described_class.create!(
          uid: SecureRandom.uuid,
          user: create_user
        )

        note.archive!

        expect(note.archived_at).to eq now
      end
    end
  end

  describe '.archived' do
    it 'returns only the archived note' do
      user = create_user

      archived = described_class.create!(
        uid: SecureRandom.uuid,
        user: user,
        archived_at: Time.zone.local(2016, 8, 1, 15, 33)
      )

      described_class.create!(
        uid: SecureRandom.uuid,
        user: user
      )

      expect(described_class.archived).to eq [archived]
    end
  end

  describe '.unarchived' do
    it 'returns only the unarchived note' do
      user = create_user

      described_class.create!(
        uid: SecureRandom.uuid,
        user: user,
        archived_at: Time.zone.local(2016, 8, 1, 15, 33)
      )

      unarchived = described_class.create!(
        uid: SecureRandom.uuid,
        user: user
      )

      expect(described_class.unarchived).to eq [unarchived]
    end
  end

  describe 'validation: does_not_exceed_free_count_limit' do
    context 'with pro subscription' do
      let(:user) { create_user(subscription: :pro) }

      it 'allows unlimited notes' do
        stub_const('Note::FREE_COUNT_LIMIT', 1)
        described_class.create!(
          title: 'my_note', user: user, uid: SecureRandom.uuid
        )

        note = described_class.create(
          title: 'my_note', user: user, uid: SecureRandom.uuid
        )

        expect(note).to be_persisted
      end

      it 'does not invoke the callback' do
        note = described_class.new(
          title: 'my_note', user: user, uid: SecureRandom.uuid
        )
        allow(note).to receive(:does_not_exceed_free_count_limit)

        note.save!

        expect(note).not_to have_received(:does_not_exceed_free_count_limit)
      end
    end

    context 'with free subscription' do
      let(:user) { create_user(subscription: :free) }

      it 'fails validation when limit is exceeded' do
        stub_const('Note::FREE_COUNT_LIMIT', 1)
        described_class.create!(
          title: 'my_note', user: user, uid: SecureRandom.uuid
        )

        note = described_class.create(
          title: 'my_note', user: user, uid: SecureRandom.uuid
        )

        expect(note).not_to be_persisted
        expect(note.errors[:base]).to eq [
          'You have reached your note limit of 1 notes. ' \
          'Please delete some notes or upgrade your subscription.'
        ]
      end
    end
  end

  def create_user(attributes = {})
    attributes = {
      email: 'user@example.com',
      password: 'asdfasdf',
      password_confirmation: 'asdfasdf'
    }.merge(attributes)

    User.create!(attributes)
  end
end
