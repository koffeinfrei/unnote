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
      'note-' + note.uid,
      JSON.stringify(
        {
          uid: note.uid,
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

      $.ajax({
        url: '/api/notes/' + note.uid,
        method: 'PUT',
        dataType: 'json',
        data: { note: note }
      })
      .done(() => {
        // if the content is still the same -> clear from localStorage
        if (note_raw === localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }

        this.setSyncStatus();
      })
      .fail(function(xhr, status, err) {
        console.error(url, status, err.toString());
      });
    }
  }

  setSyncStatus() {
    var isSynced = this.getLocalStorageKeys().length === 0;
    this.onServerSyncCallback({ isSynced: isSynced });
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
