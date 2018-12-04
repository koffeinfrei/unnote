import $ from 'jquery';
import EventHive from './EventHive';

// Shows a global spinner on every ajax request.
// The spinner is only shown if the request runs for 500ms or more.
export default function registerGlobalSpinner() {
  let timeoutId = undefined;

  $(document).ajaxStart(() => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      EventHive.publish('spinner.toggle', { show: true })
    }, 500)
  });

  $(document).ajaxStop(() => {
    clearTimeout(timeoutId);

    EventHive.publish('spinner.toggle', { show: false })
  });
}
