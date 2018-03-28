import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ResultEle from './ResultEle';
import Navbar from './Navbar'

// this class render the result summary 
export default withRouter(class Result extends Component {
  constructor(props){
    super(props);
    this.state = {
      resultList: (this.props.location.state && this.props.location.state.resultList) ? this.props.location.state.resultList : null
    };
  }

  render() {
    if (this.state.resultList) {
      return (
        <div className="Result">
          <Navbar addNewMusic={false} logout={false} musicSheets={false}/>
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
                {this.state.resultList.map((e, idx) => <ResultEle key={idx} result={e}/>)}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div>
          <Navbar/>
          <h4 align="center"> No result to show </h4>
        </div>
      )
      
    }
      
  }
})


