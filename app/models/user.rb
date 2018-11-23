class User < ApplicationRecord
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable, :registerable

  has_many :notes, dependent: :destroy
end
