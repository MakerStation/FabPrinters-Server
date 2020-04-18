import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
loader();
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

var loop = setInterval(loader, 2000)
function loader() {
  var phrases = [
    "Caricamento",
    "Loading"
  ];
  if(!document.getElementById('Loading-text')) return;
  document.getElementById('Loading-text').innerHtml = phrases[Math.floor(Math.random()*phrases.size)];
}
