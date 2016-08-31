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
      // `serverNote` is just a partial note, the response doesn't contain all
      // attributes
      .done((serverNote) => this.ajaxDone(key, noteRaw, Note.fromAttributes(serverNote)))
      .fail((xhr, status, error) => this.ajaxFail(xhr, status, error, url));
    }
  }

  setSyncStatus(isSynced, serverNote) {
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
    this.onServerSyncCallback({ isSynced: isSynced, note: serverNote });
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

  ajaxDone(key, noteRaw, serverNote) {
    // if the content is still the same -> clear from localStorage
    const localStorageNoteRaw = localStorage.getItem(key)
    if (noteRaw === localStorageNoteRaw) {
      localStorage.removeItem(key);
    }
    else {
      // update the server updated at in the localstorage item as well.  the
      // content may have been updated in the meantime from the same source. if
      // we don't do this we will get a conflict, which is not what we want in
      // this case.
      const note = Note.fromAttributes(JSON.parse(localStorageNoteRaw))
      note.serverUpdatedAt = serverNote.serverUpdatedAt;

      localStorage.setItem(
        'note-' + note.uid,
        note.toJson()
      );
    }

    this.setSyncStatus(undefined, serverNote);
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
