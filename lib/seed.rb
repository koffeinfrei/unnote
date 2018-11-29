# frozen_string_literal: true

module Seed
  def seed(model, find_or_create_by, update_with = {})
    record = model.where(find_or_create_by).first_or_initialize

    if record.update(update_with)
      record
    else
      raise "Couldn't save #{record.class} " +
        "(#{record.errors.full_messages.join(', ')}) with provided data: " +
        "#{find_or_create_by.inspect}, #{update_with.inspect}"
    end
  end
  module_function :seed

  def seed_file(name)
    File.new(Rails.root.join('db', 'seeds').join(name))
  end
  module_function :seed_file
end
