import React from 'react';
import '../static/Piano.css';

// these functions are used to render the piano
const Key = (props) => 
  <div
    className={`Key-container ${props.color}`}
    onClick={props.onPress.bind(null, props.keyNames)}
    onMouseOver={props.mouseOver.bind(null, props.keyNames)}
  ></div>

const Octave = (props) =>
  <div className="Octave-container">
    <Key {...props} color='white' keyNames={['C']} />
    <Key {...props} color='black' keyNames={['C#', 'Db']} />
    <Key {...props} color='white' keyNames={['D']} />
    <Key {...props} color='black' keyNames={['D#', 'Eb']} />
    <Key {...props} color='white' keyNames={['E']} />
    <Key {...props} color='white' keyNames={['F']} />
    <Key {...props} color='black' keyNames={['F#', 'Gb']} />
    <Key {...props} color='white' keyNames={['G']} />
    <Key {...props} color='black' keyNames={['G#', 'Ab']} />
    <Key {...props} color='white' keyNames={['A']} />
    <Key {...props} color='black' keyNames={['A#', 'Bb']} />
    <Key {...props} color='white' keyNames={['B']} />
  </div>

const Piano = (props) => 
  <div className="Piano-container">
    {Array(props.numOctaves).fill().map((element, octave) => 
      <Octave
        key={`Octave-${octave}`}
        onPress={props.onPress.bind(null, octave)}
        mouseOver={props.mouseOver.bind(null, octave)}
      />
    )}
  </div>

export default Piano;