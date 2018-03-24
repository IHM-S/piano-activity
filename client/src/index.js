import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

// here is where everthing starts, the index will create our application and put everthing under id root
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
registerServiceWorker();
