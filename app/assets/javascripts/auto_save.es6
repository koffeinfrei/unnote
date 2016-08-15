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
    this.setSyncStatus(false);

    localStorage.setItem(
      'note-' + note.uid,
      note.toJson()
    );
  }

  syncToServer() {
    if (jQuery.active) {
      return;
    }

    var keys = this.getLocalStorageKeys();

    for (var key of keys) {
      const noteRaw = localStorage.getItem(key);
      const note = JSON.parse(noteRaw);
      const url = '/api/notes/' + note.uid;

      $.ajax({
        url: url,
        method: 'PUT',
        dataType: 'json',
        data: { note: note }
      })
      .done(() => this.ajaxDone(key, noteRaw))
      .fail((xhr, status, error) => this.ajaxFail(xhr, status, error, url));
    }
  }

  setSyncStatus(isSynced) {
    if (isSynced === undefined) {
      isSynced = this.getLocalStorageKeys().length === 0;
    }

    if (isSynced) {
      window.onbeforeunload = undefined;
    }
    else {
      window.onbeforeunload = function() {
        return "Behold! You have unsynchronized changes. " +
          "If you leave the page now, your changes won't be saved to the server.\n" +
          "(Your data won't be lost, but it will only remain locally in your browser)";
      };
    }
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

  ajaxDone(key, noteRaw) {
    // if the content is still the same -> clear from localStorage
    if (noteRaw === localStorage.getItem(key)) {
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
