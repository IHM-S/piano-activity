import React, { Component } from 'react';
import { withRouter } from 'react-router';
import MusicSheetsDrop from './MusicSheetsDrop'

// this class render the navbar, user input the flag to makrsure which part to show
export default withRouter(class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      addNewMusic: !!this.props.addNewMusic,
      logout: !!this.props.logout,
      musicSheets: !!this.props.musicSheets,
      status: !!this.props.status,
      login: !!this.props.login,
      signup: !!this.props.signup
    }
  }

  click = (path, removeSession) => {
    if (removeSession) {
      localStorage.removeItem("pianoSession");
    }
    this.props.history.push({
      pathname : path
    });
  };

  displayAddNewMusic = () => {
    if (this.state.addNewMusic) {
      return (
        <li className="nav-item">
          <a className="nav-link" href="" onClick={(e) => {this.click('/newsheet', false)}}>Add New Musics</a>
        </li>
      );
    } else {
      return null;
    }
  };

  dsiplayLogout = () => {
    if (this.state.logout) {
      return(
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={(e) => {this.click('/login', true)}} >Logout</a>
        </li>);
    } else {
      return null;
    }
  };

  displayMusicSheets = () => {
    if (this.state.musicSheets) {
      return(<MusicSheetsDrop />); 
    } else {
      return null;
    }
  };

  displaySendStatus = () => {
    if (this.state.status) {
      return(
        <div>
          <li className="nav-item">
            <a className="nav-link"  href="" onClick={(e) => {
              e.preventDefault();
              this.props.getCurrentStatus();}} >Retrieve Status</a>
          </li>
        </div>);
    } else {
      return null;
    }
  };

  displayGetStatus = () => {
    if (this.state.status) {
      return(
        <div>
          <li className="nav-item">
            <a className="nav-link"  href="" onClick={(e) => {
              e.preventDefault();
              this.props.sendCurrentStatus();}} >Save Status</a>
          </li>
        </div>);
    } else {
      return null;
    }
  };

  displayLogin = () => {
    if (this.state.login) {
      return(
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={(e) => {this.click('/login', false)}} >Login</a>
        </li>
      );
    } else {
      return null;
    }
  };

  displaySignup = () => {
    if (this.state.signup) {
      return (
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={(e) => {this.click('/signup', false)}} >Signup</a>
        </li>
      );
    } else { 
      return null;
    }
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="" onClick={(e) => {this.click('/main', false)}}>Piano</a>
            <ul className="navbar-nav">
              {this.displayAddNewMusic()}
              {this.displaySendStatus()}
              {this.displayGetStatus()}
              {this.dsiplayLogout()}
              {this.displayMusicSheets()}
              {this.displayLogin()}
              {this.displaySignup()}
            </ul>
        </nav>
      </div>
    )
  }
})
