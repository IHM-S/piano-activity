import React, { Component } from 'react';

export default class ResultEle extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.result
    }

    render() {
        return (
          <tr>
            <th scope="row">{this.state.index}</th>
            <td>{this.state.correctOctave}</td>
            <td>{this.state.correctNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.state.enteredOctave}</td>
            <td>{this.state.enteredNote.replace(',', ' or ').replace('#', '♯').replace('b', '♭')}</td>
            <td>{this.state.correct ? (<i className="fas fa-check"></i>) : (<i className="fas fa-times"></i>)}</td>
          </tr>
        )
    }
}
