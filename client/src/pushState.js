import { get } from 'svelte/store'
import { location, push } from 'svelte-spa-router'

export function setNew() {
  push('/notes');
}

export function setEdit(note) {
  const currentLocation = get(location);
  // is e.g. either `notes` or `task-notes`
  const resourceName = currentLocation.split('/')[1];
  const newLocation = `/${resourceName}/${note.uid}`;

  if (currentLocation !== newLocation) {
    push(newLocation);
  }
}

export function setBrowserTitle(note) {
  if (note && note.title) {
    document.title = `${note.title} | unnote`;
  }
  else {
    document.title = 'unnote';
  }
}
