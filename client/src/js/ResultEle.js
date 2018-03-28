import React, { Component } from 'react';

// this class represent the data need to render in the result page, each of this class represent the correctness of the user's answer
export default class ResultEle extends Component {
    render() {
        return (
          <tr>
            <th scope="row">{this.props.index}</th>
            <td>{this.props.result.correctOctave}</td>
            <td>{this.props.result.correctNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.props.result.enteredOctave}</td>
            <td>{this.props.result.enteredNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.props.result.correct ? (<i className="fas fa-check"/>) : (<i className="fas fa-times"/>)}</td>
          </tr>
        )
    }
}
