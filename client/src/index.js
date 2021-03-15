import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import setGlobals from './setGlobals';

setGlobals();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
