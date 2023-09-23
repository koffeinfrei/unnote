# frozen_string_literal: true

class NoteContentCleaner
  def initialize(note)
    @note = note
  end

  # rubocop:disable Metrics/MethodLength
  def run!
    # set up geckodriver
    options = Selenium::WebDriver::Firefox::Options.new
    options.add_argument('-headless')

    driver = Selenium::WebDriver.for :firefox, options: options

    quill_js = File.read(File.expand_path('../../client/node_modules/quill/dist/quill.js', __dir__))
    content = driver.execute_script(
      <<~SCRIPT
        #{quill_js};

        // create a blank html document and append the container element
        var doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div></div>';
        document.documentElement.replaceWith(doc.documentElement);

        // use quill's api to convert the html
        var quill = new Quill(document.documentElement);
        quill.clipboard.dangerouslyPasteHTML('#{@note.content}', 'silent');
        quill.update();

        // return the updated content
        return quill.root.innerHTML;
      SCRIPT
    )

    # close browser
    driver.quit

    @note.update!(content: content)
  end
  # rubocop:enable Metrics/MethodLength
end
