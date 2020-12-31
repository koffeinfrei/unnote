# frozen_string_literal: true

desc 'Starts the client and api server using foreman'
task start: :environment do
  exec 'foreman start -p 3000'
end
