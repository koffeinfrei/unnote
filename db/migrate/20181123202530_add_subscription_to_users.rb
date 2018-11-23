class AddSubscriptionToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :subscription, :integer, default: 0

    User.find_each do |user|
      user.update! subscription: :pro
    end
  end
end
