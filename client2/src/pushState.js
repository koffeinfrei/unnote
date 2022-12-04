import { get } from 'svelte/store'
import { location, push } from 'svelte-spa-router'

export function setNew() {
  push('/notes');
}

export function setEdit(note) {
  const currentLocation = get(location);
  const newLocation = `/notes/${note.uid}`;

  if (currentLocation !== newLocation) {
    push(newLocation);
  }
}

export function setBrowserTitle(note) {
  if (note && note.title) {
    document.title = `${note.title} | Mykonote`;
  }
  else {
    document.title = 'Mykonote';
  }
}
