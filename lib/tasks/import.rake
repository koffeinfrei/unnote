# frozen_string_literal: true

namespace :import do
  desc 'Import from an evernote .enex file'
  task :evernote, %i[enex_file user_email] => [:environment] do |_task, args|
    require Rails.root.join('lib', 'evernote_importer')

    enex_file = args[:enex_file]
    user_email = args[:user_email]

    if enex_file.nil? || user_email.nil?
      abort(
        'You need to provide an enex file location and the user email ' \
        "address.\n" \
        'E.g. `rake import:evernote[Evernote.enex,user@example.com]`'
      )
    end

    EvernoteImporter.new(enex_file, user_email).run
  end
end
