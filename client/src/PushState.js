class PushState {
  constructor(history) {
    this.history = history;
  }

  setNew() {
    this.history.push('/notes');
  }

  setEdit(note) {
    const url = `/notes/${note.uid}`;

    if (this.history.location.pathname !== url) {
      this.history.push(url);
    }
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
