class AutoSave {
  constructor(onCreated) {
    this.onCreated = onCreated;
  }

  static get POLLING_INTERVAL() {
    return 2000;
  }

  startPolling() {
    setInterval(this.sync.bind(this), AutoSave.POLLING_INTERVAL);
  }

  sync() {
    if (jQuery.active) {
      return;
    }

    for (var i = 0, len = localStorage.length; i < len; ++i) {
      const key = localStorage.key(i);

      if (!key.startsWith('note-')) {
        continue;
      }

      const note_raw = localStorage.getItem(key);
      const note = JSON.parse(note_raw);

      let url;
      let method;
      let data;

      // update
      if ($.isNumeric(note.id)) {
        url = '/api/notes/' + note.id;
        method = 'PUT';
        data = { id: note.id, note: note };
      }
      // create
      else {
        url = '/api/notes/';
        method = 'POST';
        data = { note: note };
      }

      $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        data: data,
        success: (data) => {
          // if the content is still the same -> clear from localStorage
          if (note_raw === localStorage.getItem(key)) {
            localStorage.removeItem(key);
            // TODO: update react with actual id
          }

          if (method === 'POST') {
            this.onCreated(data);
          }
        },
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
        }
      });
    }
  }
}
