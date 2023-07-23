export function isPwa() {
  return matchMedia('(display-mode: standalone)').matches ||
    navigator.standalone ||
    document.referrer.includes('android-app://')
}
