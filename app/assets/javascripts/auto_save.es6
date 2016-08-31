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

    SyncStorage.set(note);
  }

  syncToServer() {
    if (jQuery.active) {
      return;
    }

    SyncStorage.eachNote((note, noteRaw) => {
      const url = '/api/notes/' + note.uid;

      $.ajax({
        url: url,
        method: 'PUT',
        dataType: 'json',
        data: { note: note }
      })
      // `serverNote` is just a partial note, the response doesn't contain all
      // attributes
      .done((serverNote) => this.ajaxDone(note, noteRaw, Note.fromAttributes(serverNote)))
      .fail((xhr, status, error) => this.ajaxFail(xhr, status, error, url));
    });
  }

  setSyncStatus(isSynced, serverNote) {
    if (isSynced === undefined) {
      isSynced = SyncStorage.isEmpty();
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

  ajaxDone(note, noteRaw, serverNote) {
    // if the content is still the same -> clear from sync storage
    const syncStorageRawNote = SyncStorage.get(note);
    if (noteRaw === syncStorageRawNote) {
      SyncStorage.remove(note);
    }
    else {
      // update the server updated at in the sync storage item as well.  the
      // content may have been updated in the meantime from the same source. if
      // we don't do this we will get a conflict, which is not what we want in
      // this case.
      const note = Note.fromAttributes(JSON.parse(syncStorageRawNote));
      note.serverUpdatedAt = serverNote.serverUpdatedAt;

      SyncStorage.set(note);
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
