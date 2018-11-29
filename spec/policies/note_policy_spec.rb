# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NotePolicy do
  context 'actions' do
    let(:user) { User.new }

    permissions :index? do
      it 'grants access to any user' do
        expect(described_class).to permit(user, Note)
      end
    end

    permissions :show? do
      it 'denies access if the note belongs to another user' do
        expect(described_class).not_to permit(user, Note.new(user: User.new))
      end

      it 'grants access if the note belongs to the user' do
        expect(described_class).to permit(user, Note.new(user: user))
      end
    end

    permissions :create? do
      it 'grants access to any user' do
        expect(described_class).to permit(user, Note.new)
      end
    end

    permissions :update? do
      it 'denies access if the note belongs to another user' do
        expect(described_class).not_to permit(user, Note.new(user: User.new))
      end

      it 'grants access if the note belongs to the user' do
        expect(described_class).to permit(user, Note.new(user: user))
      end
    end

    permissions :destroy? do
      it 'denies access if the note belongs to another user' do
        expect(described_class).not_to permit(user, Note.new(user: User.new))
      end

      it 'grants access if the note belongs to the user' do
        expect(described_class).to permit(user, Note.new(user: user))
      end
    end
  end

  permissions '.scope' do
    let(:user) do
      User.create!(
        email: 'user1@example.com',
        password: 'asdfasdf',
        password_confirmation: 'asdfasdf'
      )
    end

    let(:other_user) do
      User.create!(
        email: 'user2@example.com',
        password: 'asdfasdf',
        password_confirmation: 'asdfasdf'
      )
    end

    it 'scopes to own notes' do
      note = Note.create! user: user, uid: SecureRandom.uuid
      Note.create! user: other_user, uid: SecureRandom.uuid

      scope = NotePolicy::Scope.new(user, Note)

      expect(scope.resolve).to eq [note]
    end
  end
end
