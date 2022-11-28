import './App.sass'
import App from './App.svelte'
import registerServiceWorker from './registerServiceWorker';

const app = new App({
  target: document.getElementById('app')
})

registerServiceWorker();

export default app
