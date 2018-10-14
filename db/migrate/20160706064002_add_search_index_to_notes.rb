class AddSearchIndexToNotes < ActiveRecord::Migration[4.2]
  def up
    add_column :notes, :tsv_title, :tsvector
    add_column :notes, :tsv_content, :tsvector

    add_index :notes, :tsv_title, using: 'gin'
    add_index :notes, :tsv_content, using: 'gin'

    say_with_time 'Adding trigger functions on notes for updating tsv_title and tsv_content columns' do
      sql = <<-SQL
        CREATE TRIGGER update_title_tsvector BEFORE INSERT OR UPDATE
        ON notes FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(tsv_title, 'pg_catalog.simple', title);

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

  def down
    say_with_time 'Removing trigger functions on notes for updating tsv_title and tsv_content columns' do
      execute <<-SQL
        DROP TRIGGER update_title_tsvector ON notes;
        DROP TRIGGER update_content_tsvector ON notes;
      SQL
    end

    remove_index :notes, :tsv_title
    remove_index :notes, :tsv_content

    remove_column :notes, :tsv_title
    remove_column :notes, :tsv_content
  end
end
