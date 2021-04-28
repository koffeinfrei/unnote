import { generatePath } from 'react-router';

class PushState {
  constructor(match, history) {
    this.path = match.path;
    this.history = history;
  }

  setNew() {
    this.history.push(this.path);
  }

  setEdit(note) {
    let path = this.path;
    if (!path.includes(':id')) {
      path = `${path}/:id`;
    }
    const url = generatePath(path, { id: note.uid});

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
