class PushState {
  constructor(history) {
    this.history = history;
  }

  setNew() {
    this.history.push('/notes');
    this.setBrowserTitle();
  }

  setEdit(note) {
    this.history.push(`/notes/${note.uid}`);
    this.setBrowserTitle(note);
  }

  setBrowserTitle(note) {
    if (note && note.title) {
      document.title = `${note.title} | Mykonote`;
    }
    else {
      document.title = 'Mykonote';
    }
  }
}

export default PushState;
