import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Piano from './Piano';
import Navbar from './Navbar';
import '../static/Main.css';

const notes = { C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11 }
const GET_NOTE_URL = 'http://localhost:5000/nextnote';
const CHECK_NOTE_URL = 'http://localhost:5000/checknote';
const SEND_CURRENT_STATUS = 'http://localhost:5000/sendcurrentstatus';
const GET_CURRENT_STATUS = 'http://localhost:5000/getcurrentstatus';
const GET_AUDIO = 'http://127.0.0.1:5000/getaudio/';

// class that manage the main page, which contains piano, navbar and app header
export default withRouter(class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOctave:null,
      currentNote:null,
      enteredNote:null,
      enteredOctave:null,
      index:0,
      sheetName:'hello',
      resultList:[],
      isFinish:false,
      userName:localStorage.getItem("pianoUserName"),
      music:null,
      error:null
    }
  }

  // check the user entered answer to see if they are correct
  checkAnswer = (octave, keyNames, index, sheetName) =>
    fetch(CHECK_NOTE_URL, {
      body: JSON.stringify({
        'octave':octave,
        'notes':keyNames,
        'index':index,
        'sheetName':sheetName,
        'session':localStorage.getItem("pianoSession")
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
        'resultList':this.state.resultList,
        'index':this.state.index,
        'userName':this.state.userName,
        'sheetName':this.state.sheetName,
      }),
      cache: 'no-cache',
      headers: {
        'content-type':'application/json'
      },
      method: 'POST'
    }).then(response => response.json()).then((data) => {
      if (data.succeed) {
        this.setState({
          error:"Successfully saved your progress."
        })
      } else {
        this.setState({
          error:"Sorry, failed to save your progress."
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
      if (data.succeed) {
        this.setState({
          currentNote: data.currentNote,
          currentOctave: data.currentOctave,
          index: data.index,
          resultList: data.resultList,
          sheetName: data.sheetName,
          error: "You progress has been loaded."
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
    fetch(GET_NOTE_URL + `?sheetName=${sheetName}&index=${index}`, {
      'headers': {
          'session': localStorage.getItem("pianoSession")
        },
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      if (data.userExistence) {
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
    this.checkAnswer(octave, keyNames, this.state.index, this.state.sheetName).then((data) => {
      if (!data.userExistence) { // session is wrong
        this.props.history.push({
          pathname : '/Login',
          state: {message: "Please Login first."}
        })
      }
      if (! data.correct) {
        this.state.resultList.push(
          {'correctNote': this.state.currentNote,
           'correctOctave': this.state.currentOctave,
           'enteredOctave': octave, 
           'enteredNote': keyNames.join(','),
           'correct': false, 
           'index': this.state.index
          })
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
        error: null
      })
      this.fetchAndSet(this.state.sheetName, this.state.index);     
    });
  }

  mouseOver = (octave, keyNames) => {
    let i = octave * 12 + notes[keyNames[0]]
    this.setState({music: GET_AUDIO + i.toString()})
  }

  mouseOut = () => {
    this.setState({music: null})
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
      this.props.history.push({
        pathname: '/result',
        state: {resultList: this.state.resultList},
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.history.location.state && nextProps.history.location.state.sheetName){   
      this.fetchAndSet(nextProps.history.location.state.sheetName, 0);
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
          mouseOut={this.mouseOut}
        />
        {this.state.music ? <audio ref="audio_tag" src={this.state.music} autoPlay/> : null}
      </div>
    );
  }
})


//         