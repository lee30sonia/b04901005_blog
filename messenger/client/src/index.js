import React from 'react';
import ReactDOM from 'react-dom';
//import './style.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

setInterval(function(){ ReactDOM.render(<App />, document.getElementById('root')); }, 1000);

registerServiceWorker();
