class SyncStorage {
  static get KEY_PREFIX() {
    return 'note-';
  }

  static set(note) {
    localStorage.setItem(
      SyncStorage._getKey(note),
      note.toJson()
    );
  }

  static get(note) {
    return localStorage.getItem(SyncStorage._getKey(note));
  }

  static eachNote(callback) {
    const keys = SyncStorage._getLocalStorageKeys();

    for (let key of keys) {
      const noteRaw = localStorage.getItem(key);
      const note = JSON.parse(noteRaw);

      callback(note, noteRaw);
    }
  }

  static remove(note) {
    localStorage.removeItem(SyncStorage._getKey(note));
  }

  static isEmpty() {
    return SyncStorage._getLocalStorageKeys().length === 0;
  }

  static _getLocalStorageKeys() {
    let keys = [];
    const length = localStorage.length;

    for (let i = 0; i < length; ++i) {
      const key = localStorage.key(i);

      if (key.startsWith(SyncStorage.KEY_PREFIX)) {
        keys.push(key);
      }
    }

    return keys;
  }

  static _getKey(note) {
    return SyncStorage.KEY_PREFIX + note.uid;
  }
}
