class PushState {
  static setNew() {
    window.history.pushState({}, '', '/#/notes');
    this.setBrowserTitle();
  }

  static setEdit(note) {
    window.history.pushState({}, '', `/#/notes/${note.uid}`);
    this.setBrowserTitle(note);
  }

  static setBrowserTitle(note) {
    if (note && note.title) {
      document.title = `${note.title} | Mykonote`;
    }
    else {
      document.title = 'Mykonote';
    }
  }
}

export default PushState;
