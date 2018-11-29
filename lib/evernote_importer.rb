# frozen_string_literal: true

require Rails.root.join('lib/seed')

class EvernoteImporter
  def initialize(enex_file, user_email)
    @enex_file = enex_file
    @user = User.find_by!(email: user_email)
  end

  def run
    doc = File.open(@enex_file) { |f| Nokogiri::XML(f) }

    doc.xpath('//note').each do |note|
      content_parts = []

      title = note.css('title').text

      created_at = note.css('created').text
      updated_at = note.css('updated').text
      updated_at = created_at if updated_at.blank?
      created_at = DateTime.parse(created_at)
      updated_at = DateTime.parse(updated_at)

      content = Nokogiri::HTML(note.css('content').to_s).xpath('//en-note').children
      content_parts << content.to_s

      resources = note.css('resource')

      content.css('en-media').each_with_index do |media, i|
        resource = resources[i]
        next unless resource

        mime = resource.css('mime').text
        image_data = resource.css('data').text.delete("\n")
        image = %(<img src="data:#{mime};base64,#{image_data}" />)
        media.replace(image)
      end

      note_attributes = note.css('note-attributes')
      if note_attributes
        source_url = note_attributes.css('source-url')
        if source_url
          content_parts << %(<p>Source url: <a href="#{source_url.text}">#{source_url.text}</a></p>)
        end
      end

      note = Seed.seed Note, { title: title, user: @user }, {
        content: content_parts.join,
        created_at: created_at,
        updated_at: updated_at,
        uid: SecureRandom.uuid
      }

      note.save!

      p note
    end
  end
end
