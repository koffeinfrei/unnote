# frozen_string_literal: true

namespace :db do
  Rake::Task['db:schema:load'].enhance do
    puts 'Adding trigger functions on notes for updating tsv_title and' \
      'tsv_content columns'

    sql = <<-SQL.squish
      CREATE TRIGGER update_title_tsvector BEFORE INSERT OR UPDATE
      ON notes FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger(tsv_title, 'pg_catalog.simple', title);

      CREATE TRIGGER update_content_tsvector BEFORE INSERT OR UPDATE
      ON notes FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger(tsv_content, 'pg_catalog.simple', text_content);
    SQL

    ActiveRecord::Base.connection.execute(sql)
  end
end
