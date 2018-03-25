import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Piano from './Piano.js';
import Navbar from './Navbar';
import './Main.css';

const GET_NOTE_URL = 'http://localhost:5000/nextnote';
const CHECK_NOTE_URL = 'http://localhost:5000/checknote'

export default withRouter(class Main extends Component {
  constructor(props) {
    super(props);
    console.log("main pass in props")
    console.log(props)
    this.state = {
      currentOctave :  null,
      currentNote   :  null,
      enteredNote   :  null,
      enteredOctave :  null,
      index         :  0,
      sheetName     :  'hello',
      resultList    :  [],
      isFinish      :  false,
      userName      :  localStorage.getItem("pianoUserName")
    }
    console.log(this.state)
  }

  // check the user entered answer to see if they are correct
  checkAnswer = (octave, keyNames, index, sheetName) =>
    fetch(CHECK_NOTE_URL, {
      body: JSON.stringify({
        'octave'    : octave,
        'notes'     : keyNames,
        'index'     : index,
        'sheetName' : sheetName,
        'session'   : localStorage.getItem("pianoSession")
      }),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());
    

  // fetch next node from server and set the state
  fetchAndSet = (sheetName, index) => {
    fetch(GET_NOTE_URL + `?sheetName=${sheetName}&index=${index}&session=${localStorage.getItem("pianoSession")}`)
    .then(response => response.json())
    .then((data) => {
      if(data.userExistence){
        this.setState({
        currentNote   : data.note,
        currentOctave : data.octave,
        isFinished    : data.isFinished
        });
      } else { // session is wrong
        this.props.history.push({
          pathname : '/login',
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
          {'correctNote'   : this.state.currentNote,
           'correctOctave' : this.state.currentOctave,
           'enteredOctave' : octave, 
           'enteredNote'   : keyNames.join(','),
           'correct'       : false, 
           'index'         : this.state.index})
      } else {
        this.state.resultList.push(
          {'correctNote'   : this.state.currentNote, 
           'correctOctave' : this.state.currentOctave,
           'enteredOctave' : octave, 
           'enteredNote'   : keyNames.join(','),
           'correct'       : true, 
           'index'         : this.state.index})
      }
      this.setState({
        enteredNote: keyNames.join(','), 
        enteredOctave: octave,
        index: this.state.index + 1
      })
      this.fetchAndSet(this.state.sheetName, this.state.index);
      console.log(this.state.currentNote);
    });
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
      console.log(this.state.resultList)
      this.props.history.push({
        pathname: '/result',
        state: {resultList: this.state.resultList},
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.history.location.state && nextProps.history.location.state.sheetName){
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
        <Navbar addNewMusic={true} logout={true} musicSheets={true}/>
        <header className="App-header">
          {this.state.error ? `An error occurred: ${this.state.error}` : null}
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
        />
      </div>
    );
  }
})
