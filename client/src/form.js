export function idValue(model, attribute) {
  return `${model}_${attribute}`;
}

export function nameValue(model, attribute) {
  return `${model}[${attribute}]`;
}
