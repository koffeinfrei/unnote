import './App.sass'
import App from './App.svelte'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js', { scope: './', })
    .catch((error) => { console.error('serviceworker registration failed', error) });
}

const app = new App({
  target: document.getElementById('app')
})

export default app
