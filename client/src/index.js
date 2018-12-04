import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import setApiHost from './setApiHost';
import setGlobals from './setGlobals';
import registerGlobalSpinner from './registerGlobalSpinner';

setGlobals();
setApiHost();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

registerGlobalSpinner();
