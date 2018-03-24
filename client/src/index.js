import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';


// const GET_NOTE_URL = 'http://localhost:5000/nextnote';
// const CHECK_NOTE_URL = 'http://localhost:5000/checknote'

// // ask the back end what is the next note
// const fetchNextNote = (sheetName, index) => {
//   return fetch(GET_NOTE_URL + `?sheetName=${sheetName}&index=${index}`).then(response => response.json());
// }

// // check the user entered answer to see if they are correct
// const checkAnswer = (octave, keyNames, index, sheetName) =>
//   fetch(CHECK_NOTE_URL, {
//     body: JSON.stringify({
//       'octave'  : octave,
//       'notes'   : keyNames,
//       'index'   : index,
//       'sheetName' : sheetName
//     }),
//     cache: 'no-cache',
//     headers: {
//       'content-type': 'application/json'
//     },
//     method: 'POST'
//   }).then(response => response.json());``


// here is where everthing starts, the index will create our application and put everthing under id root
ReactDOM.render(
  <App
    // fetchNextNote={fetchNextNote}
    // checkAnswer={checkAnswer}
  />,
  document.getElementById('root')
);
registerServiceWorker();
