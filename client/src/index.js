import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const GET_NOTE_URL = 'http://localhost:5000/nextnote';
const CHECK_NOTE_URL = 'http://localhost:5000/checknote'

const fetchNextNote = (index) => {
  return fetch(GET_NOTE_URL + '?index=' + index).then(response => response.json());
} 

const checkAnswer = (octave, keyNames, index, sheetID) => 
  fetch(CHECK_NOTE_URL, {
    body: JSON.stringify({
      'octave'  : octave,
      'notes'   : keyNames,
      'index'   : index,
      'sheetID' : sheetID
    }),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  }).then(response => response.json());

ReactDOM.render(
  <App
    fetchNextNote={fetchNextNote}
    checkAnswer={checkAnswer}
  />,
  document.getElementById('root')
);
registerServiceWorker();
