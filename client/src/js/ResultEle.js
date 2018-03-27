import React, { Component } from 'react';

// this class represent the data need to render in the result page, each of this class represent the correctness of the user's answer
export default class ResultEle extends Component {
    render() {
        return (
          <tr>
            <th scope="row">{this.props.index}</th>
            <td>{this.props.correctOctave}</td>
            <td>{this.props.correctNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.props.enteredOctave}</td>
            <td>{this.props.enteredNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.props.correct ? (<i className="fas fa-check"></i>) : (<i className="fas fa-times"></i>)}</td>
          </tr>
        )
    }
}
