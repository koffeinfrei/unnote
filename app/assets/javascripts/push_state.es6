class PushState {
  static setNew() {
    history.pushState({}, '', '/notes');
    this.setBrowserTitle();
  }

  static setEdit(note) {
    history.pushState({}, '', `/notes/${note.uid}/edit`);
    this.setBrowserTitle(note);
  }

  static setBrowserTitle(note) {
    if (note) {
      document.title = `${note.title} | Mykonote`;
    }
    else {
      document.title = 'Mykonote';
    }
  }
}
