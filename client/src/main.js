import './App.sass'
import App from './App.svelte'
import { mount } from "svelte";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js', { scope: './', })
    .catch((error) => { console.error('serviceworker registration failed', error) });
}

const app = mount(App, {
  target: document.getElementById('app')
})

export default app
