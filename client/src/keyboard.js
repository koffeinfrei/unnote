import Mousetrap from 'mousetrap'
import EventHive from './EventHive';

// always fire shortcuts inside input fields
Mousetrap.prototype.stopCallback = function() { return false }

Mousetrap.bind('alt+shift+f', function() {
  EventHive.publish('search.focus');

  return false;
});

Mousetrap.bind('alt+shift+n', function() {
  EventHive.publish('note.new');

  return false;
});
