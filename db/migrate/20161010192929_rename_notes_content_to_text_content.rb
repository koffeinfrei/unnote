# frozen_string_literal: true

class RenameNotesContentToTextContent < ActiveRecord::Migration[4.2]
  # rubocop:disable Metrics/MethodLength
  def up
    rename_column :notes, :content, :text_content

    message = 'Adding trigger functions on notes for updating tsv_title and ' \
      'tsv_content columns'

    say_with_time message do
      sql = <<-SQL.squish
        DROP TRIGGER update_content_tsvector ON notes;
        CREATE TRIGGER update_content_tsvector BEFORE INSERT OR UPDATE
        ON notes FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(tsv_content, 'pg_catalog.simple', text_content);
      SQL

      execute(sql)
    end

    say_with_time 'Triggering generating indexes' do
      update('UPDATE notes SET title = title')
    end
  end

  def down
    rename_column :notes, :text_content, :content

    message = 'Adding trigger functions on notes for updating tsv_title and ' \
      'tsv_content columns'

    say_with_time message do
      sql = <<-SQL.squish
        DROP TRIGGER update_content_tsvector ON notes;
        CREATE TRIGGER update_content_tsvector BEFORE INSERT OR UPDATE
        ON notes FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(tsv_content, 'pg_catalog.simple', content);
      SQL

      execute(sql)
    end

    say_with_time 'Triggering generating indexes' do
      update('UPDATE notes SET title = title')
    end
  end
  # rubocop:enable Metrics/MethodLength
end
