import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Navbar from 'client/js/Navbar';
import "client/static/NewSheet.css";

const ADD_NEW_SHEET = 'http://localhost:5000/addnewsheet';

// this class renders the new sheet page, which the user add new music sheet
export default withRouter(class NewSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: localStorage.getItem("pianoUserName"),
      sheetName: null,
      content: null,
      message: null,
    }
    console.log(this.state);
  }

  submitNewSheet = () => {
    // if username and password match regex then pass them into backend
    if (/^[a-zA-Z0-9][a-zA-Z0-9 ]{2,28}[a-zA-Z0-9]$/.test(this.state.sheetName) && /^\[[012],([CDEFGAB]|[CDFGA]#|[DEGAB]b)\](\.\[[012],([CDEFGAB]|[CDFGA]#|[DEGAB]b)\])*$/.test(this.state.content)) {
      fetch(ADD_NEW_SHEET, {
        'body': JSON.stringify(
          {
            'sheetName': this.state.sheetName,
            'content': this.state.content,
            'session': localStorage.getItem("pianoSession")
          }),
          'cache': 'no-cache',
          'headers': {
                      'content-type': 'application/json'
                      },
          'method': 'POST'
      }).then((response) => response.json()).then((response) => {
        if(response.userExistence) {
          if(response.succeed){
            this.props.history.push({
              pathname: '/main'
            })
          } else { // failed, sheetName already exist
            this.setState({message: "Sheet name already exist."})
          }
        } else { // if user doesn't exist (session incorrect) then push to login
          this.props.history.push({
            pathname: '/login',
            state: {message: "Please Login first."}
          })
        }
      }).catch((err) => { // server side wrong
        console.log(err);
        this.setState({message: 'Unable to connect to the server.'});
      });
    } else {
      this.setState({message: "SheetName or content doesn't match corresponded regex."});
    } 
  }

  render() {
    return (
      <div>
        <Navbar logout={true}/>
        <div className="wrapper" onSubmit={(e) => {e.preventDefault(); this.submitNewSheet();}}>
          <form className="form-new-sheet">
            <h2 className="form-new-sheet-header">Adding New Music Sheet</h2>
            <div className="row">
              <label className="col-md-2" htmlFor="sheetName">Sheet Name: </label>
              <input type="text" className="col-md-10 form-control" id="sheetName" name="sheetName" onChange={(e) => {this.setState({'sheetName' : e.target.value}); console.log("sheetName: " + this.state.sheetName);}} placeholder="SheetName: ^[a-zA-Z0-9][a-zA-Z0-9 ]{2,28}[a-zA-Z0-9]$" required="true" autoFocus="" />
            </div>
            <div className="form-group">
              <div className="row">
                <label className="col-md-2" htmlFor="notecontent">Content: </label>
                <textarea className="col-md-10 form-control" id="notecontent" rows="5" onChange={(e) => {this.setState({'content' : e.target.value}); console.log("content: " + this.state.content);}} placeholder="Use '[]' to group note and octave, use ',' to seperate note and octave, use '.' to seperate group of octave and notes. Example: [1,C].[0,B].[1,A] " required="true"/>
              </div>
            </div>
            <div className="">
              <button className="btn btn-md btn-primary btn-block" type="submit">submit</button>
            </div>
            <p>{this.state.message}</p>
          </form>
        </div>
      </div>
    );
  }
})
