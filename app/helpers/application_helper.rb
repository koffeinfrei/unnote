module ApplicationHelper
  extend self

  def inline_svg(file_name)
    file_path = Rails.root.join("app/assets/images/#{file_name}")

    raise "The svg image '#{file_path}' does not exist!" unless File.exist?(file_path)

    File.read(file_path).html_safe
  end
end
