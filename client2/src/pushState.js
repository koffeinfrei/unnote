import { get } from 'svelte/store'
import { location, push } from 'svelte-spa-router'

export function setNew() {
  console.log('push setNew')
  push('/notes');
}

export function setEdit(note) {
  const currentLocation = get(location);
  const newLocation = `/notes/${note.uid}`;

  console.log('push setEdit x', currentLocation, newLocation)
  if (currentLocation !== newLocation) {
    push(newLocation);
  }
}

export function setBrowserTitle(note) {
  console.log('push setBrowserTitle')
  if (note && note.title) {
    document.title = `${note.title} | Mykonote`;
  }
  else {
    document.title = 'Mykonote';
  }
}
