// TODO maybe remove proxy flash components (alert, ...)?
export function show(name, message) {
  const e = new CustomEvent(getEventName(name), { detail: { message: message } });
  document.dispatchEvent(e);
}

export function clear(name) {
  const e = new CustomEvent(getEventName(name), { detail: { message: null } });
  document.dispatchEvent(e);
}

export function getEventName(name) {
  return `unnote.flash.${name}`;
}
