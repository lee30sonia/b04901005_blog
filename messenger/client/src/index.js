import React from 'react';
import ReactDOM from 'react-dom';
//import './style.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var defaultP = {
    name: "Mike Ross",
    img: "http://emilcarlsson.se/assets/mikeross.png",
    contacts: [{
        name: "Louis Litt",
        img: "http://emilcarlsson.se/assets/louislitt.png"
    }]
};
ReactDOM.render(<App p={defaultP} />, document.getElementById('root'));
registerServiceWorker();
