export function isFeatureEnabled(name) {
  const item = localStorage.getItem(`feature-${name}`);
  return !!JSON.parse(item);
}
