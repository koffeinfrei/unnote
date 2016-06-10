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
      const url = '/api/notes/' + note.uid;

      $.ajax({
        url: url,
        method: 'PUT',
        dataType: 'json',
        data: { note: note }
      })
      .done(() => this.ajaxDone(key, note_raw))
      .fail((xhr, status, error) => this.ajaxFail(xhr, status, error, url));
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

  ajaxDone(key, note_raw) {
    // if the content is still the same -> clear from localStorage
    if (note_raw === localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }

    this.setSyncStatus();
  }

  ajaxFail(xhr, status, error, url) {
    // 0 == UNSENT -> most probably no internet connection
    if (xhr.readyState === 0) {
      return;
    }
    AlertFlash.show('Something went sideways: ' + error.toString());
    console.error('url: ', url, 'xhr: ', xhr, 'status: ', status, 'err: ', error.toString());
  }
}
