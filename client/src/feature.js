export function isFeatureEnabled(name) {
  // enable all features for browser tests
  if (navigator.webdriver) { return true; }

  const item = localStorage.getItem(`feature-${name}`);
  return !!JSON.parse(item);
}
