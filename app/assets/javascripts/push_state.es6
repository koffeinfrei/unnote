class PushState {
  static setNew() {
    history.pushState({}, '', '/notes');
  }

  static setEdit(note) {
    history.pushState({}, '', `/notes/${note.uid}/edit`);
  }
}
