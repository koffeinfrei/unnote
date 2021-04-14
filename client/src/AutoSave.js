import { ajax, objectWithNestedKeys } from './ajax';
import SyncStorage from './SyncStorage';
import Note from './Note';
import AlertFlash from './AlertFlash';

class AutoSave {
  constructor(onServerSync) {
    this.onServerSyncCallback = onServerSync;

    this.setSyncStatus();
  }

  static get POLLING_INTERVAL() {
    return 3000;
  }

  startPolling() {
    this.interval = setInterval(this.syncToServer.bind(this), AutoSave.POLLING_INTERVAL);
  }

  stopPolling() {
    clearInterval(this.interval);
  }

  setChange(note) {
    this.setSyncStatus(false);

    SyncStorage.set(note);
  }

  syncToServer() {
    if (this.syncInProgress) { return; }

    this.syncInProgress = true;
    const requests = [];

    SyncStorage.eachNote((note, noteRaw) => {
      const url = '/api/notes/' + note.uid;

      const request = ajax(url, 'PUT', objectWithNestedKeys(note, 'note'));

      requests.push(request);

      request
        // `serverNote` is just a partial note, the response doesn't contain all
        // attributes
        .then((serverNote) => this.ajaxDone(note, noteRaw, Note.fromAttributes(serverNote)))
        .catch((error) => this.ajaxFail(error, url));
    });

    Promise.allSettled(requests).then(() => this.syncInProgress = false);
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

  ajaxFail(error, url) {
    // being offline is not an error
    if (!window.navigator.onLine) {
      return;
    }

    if (error.status === 401) {
      AlertFlash.show(
        // we could actually link to the current page with `href=""`, but by
        // doing this the title input field contains the wrong value once we
        // are redirected back after login (the value is loaded from the
        // server, and the save request call doesn't update the title field).
        // the cheap solution for now is to redirect to the root page, so the
        // user has to click on the note, which will properly update the
        // fields.
        // TODO: use the current page link and fix the update of the title
        // field
        'Your session has expired. You need to <a href="/" class="alert-link">sign in</a> again.<br>' +
        "Your changes won't be lost, once you're signed in they will be saved to the server."
      );
    }
    // "Unprocessable entity" is returned when a validation error occurs.
    // the most common use case is when the number of notes allowed for the
    // free subscription is exceeded.
    else if (error.status === 422) {
      AlertFlash.show(error.responseJson.errors.join('<br>'));
    }
    else {
      AlertFlash.show('Something went sideways: ' + error.message);
      console.error('url: ', url, 'error: ', error.toString());
    }
  }
}

export default AutoSave;
