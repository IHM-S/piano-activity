import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Piano from './Piano.js';
import Navbar from './Navbar';
import './Main.css';

import music0 from '../sounds/0.wav';
import music1 from '../sounds/1.wav';
import music2 from '../sounds/2.wav';
import music3 from '../sounds/3.wav';
import music4 from '../sounds/4.wav';
import music5 from '../sounds/5.wav';
import music6 from '../sounds/6.wav';
import music7 from '../sounds/7.wav';
import music8 from '../sounds/8.wav';
import music9 from '../sounds/9.wav';
import music10 from '../sounds/10.wav';
import music11 from '../sounds/11.wav';
import music12 from '../sounds/12.wav';
import music13 from '../sounds/13.wav';
import music14 from '../sounds/14.wav';
import music15 from '../sounds/15.wav';
import music16 from '../sounds/16.wav';
import music17 from '../sounds/17.wav';
import music18 from '../sounds/18.wav';
import music19 from '../sounds/19.wav';
import music20 from '../sounds/20.wav';
import music21 from '../sounds/21.wav';
import music22 from '../sounds/22.wav';
import music23 from '../sounds/23.wav';
import music24 from '../sounds/24.wav';
import music25 from '../sounds/25.wav';
import music26 from '../sounds/26.wav';
import music27 from '../sounds/27.wav';
import music28 from '../sounds/28.wav';
import music29 from '../sounds/29.wav';
import music30 from '../sounds/30.wav';
import music31 from '../sounds/31.wav';
import music32 from '../sounds/32.wav';
import music33 from '../sounds/33.wav';
import music34 from '../sounds/34.wav';
import music35 from '../sounds/35.wav';

var music = [music0, music1, music2, music3, music4, music5, music6, music7, music8, music9, music10, music11, music12, music13, music14, music15, music16, music17, music18, music19, music20, music21, music22, music23, music24, music25, music26, music27, music28, music29, music30, music31, music32, music33, music34, music35];
var notes = {C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11}

const GET_NOTE_URL = 'http://localhost:5000/nextnote';
const CHECK_NOTE_URL = 'http://localhost:5000/checknote';
const SEND_CURRENT_STATUS = 'http://localhost:5000/sendcurrentstatus';
const GET_CURRENT_STATUS = 'http://localhost:5000/getcurrentstatus';

// class that manage the main page, which contains piano, navbar and app header
export default withRouter(class Main extends Component {
  constructor(props) {
    super(props);
    console.log("main pass in props");
    console.log(props);
    this.state = {
      currentOctave: null,
      currentNote: null,
      enteredNote: null,
      enteredOctave: null,
      index: 0,
      sheetName: 'hello',
      resultList: [],
      isFinish: false,
      userName: localStorage.getItem("pianoUserName"),
      music: null
    }
    console.log(this.state);
  }

  // check the user entered answer to see if they are correct
  checkAnswer = (octave, keyNames, index, sheetName) =>
    fetch(CHECK_NOTE_URL, {
      body: JSON.stringify({
        'octave': octave,
        'notes': keyNames,
        'index': index,
        'sheetName': sheetName,
        'session': localStorage.getItem("pianoSession")
      }),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());
  
  // when user want to save the progress, press the navbutton, this function will be called
  sendCurrentStatus = () => {
    fetch(SEND_CURRENT_STATUS, {
      body: JSON.stringify({
        'resultList': this.state.resultList,
        'index': this.state.index,
        'userName': this.state.userName,
        'sheetName': this.state.sheetName,
      }),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json()).then((data) => {
      console.log("send status");
      console.log(data);
      if(data.succeed) {
        this.setState({
          error: "Successfully saved your progress."
        })
      } else {
        this.setState({
          error: "Sorry, failed to save your progress."
        })
      }
    }).catch((err) => {
      this.setState({error: 'An error occurred: Unable to connect to the server'});
    });
  }

  // get user's progress from backend
  getCurrentStatus = () => {
    fetch(GET_CURRENT_STATUS + `?userName=${this.state.userName}`)
    .then(response => response.json())
    .then((data) => {
      console.log("get status");
      console.log(data);
      if(data.succeed){
        this.setState({
          currentNote: data.currentNote,
          currentOctave: data.currentOctave,
          index: data.index,
          resultList: data.resultList,
          sheetName: data.sheetName
        })
      } else {
        this.setState({error: "You don't have any progress saved."});
      }
    }).catch((err) => {
      this.setState({error: 'An error occurred: Unable to connect to the server'});
    });
  }

  // fetch next node from server and set the state
  fetchAndSet = (sheetName, index) => {
    fetch(GET_NOTE_URL + `?sheetName=${sheetName}&index=${index}&session=${localStorage.getItem("pianoSession")}`)
    .then(response => response.json())
    .then((data) => {
      if(data.userExistence){
        this.setState({
        currentNote: data.note,
        currentOctave: data.octave,
        isFinished: data.isFinished
        });
      } else { // session is wrong
        this.props.history.push({
          pathname: '/login',
          state: {message: "Please Login first."}
        })
      }
      
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
  }

  // what happen when key of piano is pressed
  onPress = (octave, keyNames) => {
    console.log('key pressed: ' + keyNames)
    this.checkAnswer(octave, keyNames, this.state.index, this.state.sheetName).then((data) => {
      console.log(data);
      if(!data.userExistence){ // session is wrong
        this.props.history.push({
          pathname : '/Login',
          state: {message: "Please Login first."}
        })
      }
      if(! data.correct){
        this.state.resultList.push(
          {'correctNote': this.state.currentNote,
           'correctOctave': this.state.currentOctave,
           'enteredOctave': octave, 
           'enteredNote': keyNames.join(','),
           'correct': false, 
           'index': this.state.index})
      } else {
        this.state.resultList.push(
          {'correctNote': this.state.currentNote, 
           'correctOctave': this.state.currentOctave,
           'enteredOctave': octave, 
           'enteredNote': keyNames.join(','),
           'correct': true, 
           'index': this.state.index})
      }      
      this.setState({
        enteredNote: keyNames.join(','), 
        enteredOctave: octave,
        index: this.state.index + 1,
      })
      this.fetchAndSet(this.state.sheetName, this.state.index);
      console.log(this.state.currentNote);
    });
  }

  mouseOver = (octave, keyNames) => {
    let i = octave * 12 + notes[keyNames[0]]
    console.log("key index: ", i)
    this.setState({music: music[i]})
  }

  getNote() {
    return this.state.currentNote.replace('#', '♯').replace('b', '♭');
  }

  getOctave() {
    return this.state.currentOctave;
  }

  componentDidMount(){
    this.fetchAndSet(this.state.sheetName, this.state.index);
  }

  componentDidUpdate(){
    if(this.state.isFinished){
      console.log(this.state.resultList);
      this.props.history.push({
        pathname: '/result',
        state: {resultList: this.state.resultList},
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.history.location.state && nextProps.history.location.state.sheetName){
      console.log("next props");
      this.fetchAndSet(nextProps.history.location.state.sheetName, 0);
      console.log(this.state);
      this.setState({
        sheetName : nextProps.history.location.state.sheetName,
        index : 0,
        resultList: []
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar addNewMusic={true} logout={true} musicSheets={true} status={true} sendCurrentStatus={this.sendCurrentStatus} getCurrentStatus={this.getCurrentStatus}/>
        <header className="App-header">
          {this.state.error ? `${this.state.error}` : null}
          {
            this.state.currentNote ?
              <div className="App-display">
                <div className="App-name">Hi, {localStorage.getItem('pianoUserName')}</div>
                <div className="APP-note-music-sheet-name">Music Sheet Name: {this.state.sheetName} </div>
                <div className="App-note-octave-display">Octave: {this.getOctave()}</div>
                <div className="App-note-name-display">Note: {this.getNote()}</div>
              </div>
            :
              <div className="App-note-loading">loading...</div>
          }
          When a note appears above, play the corresponding note on the piano keyboard.
        </header>
        <Piano
          numOctaves={3}
          onPress={this.onPress}
          mouseOver={this.mouseOver}
        />
        {this.state.music ? <audio ref="audio_tag" src={this.state.music} autoPlay/> : null}
        
      </div>
    );
  }
})


//         