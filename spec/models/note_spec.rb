# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Note do
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
            created_at: Time.zone.local(2016, 8, 1, 15, 33).as_json,
            updated_at: Time.zone.local(2016, 8, 1, 15, 33).as_json,
            archived_at: nil,
            tasks: nil
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
    let(:image1_data) do
      'data:image/png;base64,/9j/4AAQSkZJRgABAQEASABKdhH//2Q='
    end

    let(:image2_data) do
      'data:image/png;base64,/8c/4AAQSkZJRgABAQEASABKdhH//2Q='
    end

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

  describe 'task scopes' do
    let(:user) { create_user }

    let(:having_todo_task) do
      described_class.create!(
        uid: SecureRandom.uuid,
        user: user,
        content: '<ul class="task-list"><li>a</li></ul>'
      )
    end

    let(:having_done_task) do
      described_class.create!(
        uid: SecureRandom.uuid,
        user: user,
        content: '<ul class="task-list"><li class="checked">a</li></ul>'
      )
    end

    let(:having_no_task) do
      described_class.create!(
        uid: SecureRandom.uuid,
        user: user,
        content: '<ul><li>a</li><li>b</li></ul>'
      )
    end

    before do
      having_todo_task
      having_done_task
      having_no_task
    end

    describe '.having_todo_tasks' do
      it 'returns only the note containing a todo task' do
        expect(described_class.having_todo_tasks).to eq [having_todo_task]
      end
    end

    describe '.having_done_tasks' do
      it 'returns only the note containing a todo task' do
        expect(described_class.having_done_tasks).to eq [having_done_task]
      end
    end

    describe '.having_tasks' do
      it 'returns only the notes containing a task' do
        expect(described_class.having_tasks).to eq [having_todo_task, having_done_task]
      end
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

  describe 'before_save > populate_tasks' do
    it 'calls NoteTaskPopulator on save' do
      note = build_note(user: create_user)
      populator = instance_spy(NoteTaskPopulator)
      allow(NoteTaskPopulator).to receive(:new).with(note).and_return(populator)

      note.save!

      expect(populator).to have_received(:run)
    end
  end
end
