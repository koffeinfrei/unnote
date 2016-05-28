class AutoSave {
  constructor(onServerSync) {
    this.onServerSyncCallback = onServerSync;

    this.setSyncStatus();
  }

  static get POLLING_INTERVAL() {
    return 3000;
  }

  startPolling() {
    setInterval(this.syncToServer.bind(this), AutoSave.POLLING_INTERVAL);
  }

  setChange(note) {
    this.onServerSyncCallback({ isSynced: false });

    localStorage.setItem(
      'note-' + note.id,
      JSON.stringify(
        {
          id: note.id,
          title: note.title,
          content: note.content
        }
      )
    );
  }

  syncToServer() {
    if (jQuery.active) {
      return;
    }

    var keys = this.getLocalStorageKeys();

    for (var key of keys) {
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
          }

          this.onChange(data);
        },
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
        }
      });
    }
  }

  setSyncStatus() {
    this.onChange({});
  }

  onChange(note) {
    var isSynced = this.getLocalStorageKeys().length === 0;
    this.onServerSyncCallback($.extend(note, { isSynced: isSynced }));
  }

  getLocalStorageKeys() {
    var keys = [];
    var length = localStorage.length;

    for (var i = 0; i < length; ++i) {
      var key = localStorage.key(i);

      if (key.startsWith('note-')) {
        keys.push(key);
      }
    }

    return keys;
  }
}
