namespace :mobile do
  namespace :assets do
    task precompile: :environment do
      puts 'Precompiling the rails assets'

      `RAILS_ENV=local_production bundle exec rake assets:clobber assets:precompile`
    end

    namespace :copy do
      desc 'Copies the application.js file to the mobile application'
      # This task assumes that the mobile application is checked out as
      # "mykonote-app" in the same directory as this project
      task js: :precompile do
        puts 'Copying the latest application.js to the mobile app'

        `cat $(ls -tr public/assets/application-*.js | tail -1) > \
         ../mykonote-app/www/js/application.js`
      end

      desc 'Copies the application.css file to the mobile application'
      # This task assumes that the mobile application is checked out as
      # "mykonote-app" in the same directory as this project
      task css: :precompile do
        puts 'Copying the latest application.css to the mobile app'

        `cp $(ls -tr public/assets/application-*.css | tail -1) \
         ../mykonote-app/www/css/application.css`
      end
    end

    desc 'Copies the application.{css,js} files to the mobile application'
    task copy: [:'mobile:assets:copy:js', :'mobile:assets:copy:css']
  end
end
