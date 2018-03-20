import React, { Component } from 'react';
import Piano from './Piano.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOctave: null,
      currentNote: null,
      enteredNote: null,
      enteredOctave: null,
      index : 0,
      sheetID : 1,
      faultList : [],
      isFinish : false
    }

  }

  onPress = (octave, keyNames) => {
    this.setState({enteredNote: keyNames.join(',')}) 
    this.setState({enteredOctave: octave})
    this.props.checkAnswer(octave, keyNames, this.state.index, this.state.sheetID).then((data) => {
      console.log(data);
      if(! data.correct){
        this.state.faultList.push(
          {'correctNote' : this.state.currentNote, 'correctOctave' : this.state.currentOctave, 
           'enteredOctave' : this.state.enteredOctave, 'enteredNote' : this.state.enteredNote})
      }
      
      this.setState({index: this.state.index + 1})
      this.props.fetchNextNote(this.state.index).then((data) => {
      this.setState({currentNote: data.note});
      this.setState({currentOctave: data.octave})
      this.setState({isFinished: data.isFinished})

      }).catch((err) => {
        this.setState({error: 'Unable to connect to the server'});
      });
      console.log(this.state.currentNote)
    });
  }

  getNote() {
    return this.state.currentNote.replace('#', '♯').replace('b', '♭');
  }

  getOctave() {
    return this.state.currentOctave;
  }

  componentWillMount(){
    console.log(this.state.currentNote)
    this.props.fetchNextNote(this.state.index).then((data) => {
      this.setState({currentNote: data.note});
      this.setState({currentOctave: data.octave})
      this.setState({isFinished: data.isFinished})
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
  }

  render() {
    if(this.state.isFinished){
      console.log(this.state.faultList)
      return (
        <div className="Result">
          {this.state.faultList.forEach(e => { <div>e</div>  } )}
        </div>)
    } else {
      return (
      <div className="App">
        <header className="App-header">
          {this.state.error ? `An error occurred: ${this.state.error}` : null}

          {
            this.state.currentNote ?
              <div className="App-display">
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
  }
}

export default App;