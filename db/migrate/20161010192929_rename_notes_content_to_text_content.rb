class RenameNotesContentToTextContent < ActiveRecord::Migration[4.2]
  def up
    rename_column :notes, :content, :text_content

    say_with_time 'Adding trigger functions on notes for updating tsv_title and tsv_content columns' do
      sql = <<-SQL
        DROP TRIGGER update_content_tsvector ON notes;
        CREATE TRIGGER update_content_tsvector BEFORE INSERT OR UPDATE
        ON notes FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(tsv_content, 'pg_catalog.simple', text_content);
      SQL

      execute(sql)
    end

    say_with_time 'Triggering generating indexes' do
      update("UPDATE notes SET title = title")
    end
  end

  def down
    rename_column :notes, :text_content, :content

    say_with_time 'Adding trigger functions on notes for updating tsv_title and tsv_content columns' do
      sql = <<-SQL
        DROP TRIGGER update_content_tsvector ON notes;
        CREATE TRIGGER update_content_tsvector BEFORE INSERT OR UPDATE
        ON notes FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(tsv_content, 'pg_catalog.simple', content);
      SQL

      execute(sql)
    end

    say_with_time 'Triggering generating indexes' do
      update("UPDATE notes SET title = title")
    end
  end
end
