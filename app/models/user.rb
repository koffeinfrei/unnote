class User < ApplicationRecord
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable, :registerable

  has_many :notes, dependent: :destroy

  enum subscription: { free: 0, pro: 1 }

  before_create { self.subscription ||= :free }

  validates :password_confirmation, presence: true
end
