import React, { Component } from 'react';
import Piano from './Piano.js';
import Result from './Result';
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
      sheetName : 'hello',
      resultList : [],
      isFinish : false
    }

  }

  onPress = (octave, keyNames) => {
    console.log('key pressed: ' + keyNames)
    this.setState({
      enteredNote: keyNames.join(','),
      enteredOctave: octave
    })
    this.props.checkAnswer(octave, keyNames, this.state.index, this.state.sheetName).then((data) => {
      console.log(data);
      if(! data.correct){
        this.state.resultList.push(
          {'correctNote' : this.state.currentNote, 'correctOctave' : this.state.currentOctave,
           'enteredOctave' : this.state.enteredOctave, 'enteredNote' : this.state.enteredNote,
           'correct' : false, 'index' : this.state.index})
      } else {
        this.state.resultList.push(
          {'correctNote' : this.state.currentNote, 'correctOctave' : this.state.currentOctave,
           'enteredOctave' : this.state.enteredOctave, 'enteredNote' : this.state.enteredNote,
           'correct' : true, 'index' : this.state.index})
      }

      this.setState({index: this.state.index + 1})
      this.props.fetchNextNote(this.state.sheetName, this.state.index).then((data) => {
      this.setState({
        currentNote: data.note,
        currentOctave: data.octave,
        isFinished: data.isFinished
      });

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
    this.props.fetchNextNote(this.state.sheetName, this.state.index).then((data) => {
      this.setState({
        currentNote: data.note,
        currentOctave: data.octave,
        isFinished: data.isFinished
      });
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
    console.log("localStorage:  " + localStorage.getItem("myCat"))
  }

  close() {
      this.setState({ isFinish : false})
  }

  render() {
    
    if(this.state.isFinished){
      console.log(this.state.resultList)
      return (
        <div className="Result">
            <h4 align="center"> Result Summary </h4>
            <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Correct Octave</th>
                    <th scope="col">Correct Note</th>
                    <th scope="col">Entered Octave</th>
                    <th scope="col">Entered Note</th>
                    <th scope="col">Correctness</th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.resultList.map((e, idx) => <Result key={idx} result={e}/>)}
                </tbody>
            </table>
        </div>)
    } else {
      return (
      <div className="App">
        <header className="App-header">
          {this.state.error ? `An error occurred: ${this.state.error}` : null}

          {
            this.state.currentNote ?
              <div className="App-display">
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
  }
}

export default App;
