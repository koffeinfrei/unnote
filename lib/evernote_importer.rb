require Rails.root.join('lib/seed')

class EvernoteImporter
  def initialize(enex_file, user_email)
    @enex_file = enex_file
    @user = User.find_by!(email: user_email)
  end

  def run
    doc = File.open(@enex_file) { |f| Nokogiri::XML(f) }

    doc.xpath('//note').each do |note|
      title = note.css('title').text

      created_at = note.css('created').text
      updated_at = note.css('updated').text
      if updated_at.blank?
        updated_at = created_at
      end
      created_at = DateTime.parse(created_at)
      updated_at = DateTime.parse(updated_at)

      content = Nokogiri::HTML(note.css('content').to_s).xpath('//en-note').children

      resources = note.css('resource')

      content.css('en-media').each_with_index do |media, i|
        resource = resources[i]
        mime = resource.css('mime').text
        image_data = resource.css('data').text.gsub("\n", '')
        image = %{<img src="data:#{mime};base64,#{image_data}" />}
        media.replace(image)
      end

      note = Seed.seed Note, { title: title, user: @user }, {
        content: content.to_s,
        created_at: created_at,
        updated_at: updated_at,
        uid: SecureRandom.uuid
      }

      note.save!

      p note
    end
  end
end
