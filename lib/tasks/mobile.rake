require './lib/deploy_client'

namespace :mobile do
  # This task assumes that the mobile application is checked out as
  # "mykonote-app" in the same directory as this project
  desc 'Builds and copies the client application to the mobile application'
  task copy: :environment do
    DeployClient.new.deploy_mobile

    [
      [
        '<div id="root"></div>',

        '<div id="root"></div>' \
        '<script src="cordova.js"></script>' \
        '<script src="js/index.js"></script>' \
        '<script src="js/sane_file_reader.js"></script>' \
        '<script src="js/share_to.js"></script>'

      ],
      [
        '</head>',

        '<link rel="stylesheet" type="text/css" href="css/index.css">' \
        '</head>'
      ]
    ].each do |from, to|
      from, to = [from, to].map { |x| x.gsub('/', '\/') }
      `sed -i 's/#{from}/#{to}/' ../mykonote-app/www/index.html`
    end
  end
end
