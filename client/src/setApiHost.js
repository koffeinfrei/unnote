import $ from 'jquery';

// ability to set a different host for the API calls. this is needed for the
// mobile app.
export default function setApiHost() {
  if (!window.API_HOST) { return; }

  $.ajaxPrefilter(function(options) {
    options.url = window.API_HOST + options.url;
  });
}
