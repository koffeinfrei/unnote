class PushState {
  constructor(match, history) {
    this.path = match.path;
    this.history = history;
  }

  setNew() {
    this.history.push(this.path);
  }

  setEdit(note) {
    const url = `${this.path}/${note.uid}`;

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
