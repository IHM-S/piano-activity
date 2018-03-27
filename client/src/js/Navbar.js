import React, { Component } from 'react';
import { withRouter } from 'react-router';
import MusicSheetsDrop from 'client/js/MusicSheetsDrop'

// this class render the navbar, user input the flag to makrsure which part to show
export default withRouter(class Navbar extends Component {
  constructor(props){
    super(props);
    console.log("Navbar");
    console.log(props);
    this.state = {
      addNewMusic: this.props.addNewMusic ? true : false,
      logout: this.props.logout ? true : false,
      musicSheets: this.props.musicSheets ? true : false,
      status: this.props.status ? true : false,
      login: this.props.login ? true : false,
      signup: this.props.signup ? true : false
    }
  }

  clickLogout = () => {
    console.log("click logout");
    localStorage.removeItem("pianoSession");
    this.props.history.push({
      pathname : '/login'
    });
  }

  clickPiano = () => {
    console.log("click piano");
    this.props.history.push({
      pathname : '/main'
    });
  }

  clickAdd = () => {
    console.log("click add new sheet");
    this.props.history.push({
      pathname : '/newsheet'
    });
  }

  clickLogin = () =>{
    console.log("click login");
    this.props.history.push({
      pathname : '/login'
    });
  }

  clickSignup = () =>{
    console.log("click signup"); 
    this.props.history.push({
      pathname : '/signup'
    });
  }



  displayAddNewMusic = () => {
    if(this.state.addNewMusic){
      return (
        <li className="nav-item">
          <a className="nav-link" href="" onClick={this.clickAdd}>Add New Musics</a>
        </li>
      );
    } else {
      return null;
    } 
    
  }

  dsiplayLogout = () => {
    if(this.state.logout){
      return(
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={this.clickLogout} >Logout</a>
        </li>);
    } else {
      return null;
    }
  }

  displayMusicSheets = () => {
    if(this.state.musicSheets){
      return(<MusicSheetsDrop />); 
    } else {
      return null;
    }
  }

  displaySendStatus = () => {
    if(this.state.status){
      return(
        <div>
          <li className="nav-item">
            <a className="nav-link"  href="" onClick={(e) => {e.preventDefault(); this.props.getCurrentStatus();}} >Retrieve Status</a>
          </li>
        </div>);
    } else {
      return null;
    }
  }

  displayGetStatus = () => {
    if(this.state.status){
      return(
        <div>
          <li className="nav-item">
            <a className="nav-link"  href="" onClick={(e) => {e.preventDefault(); this.props.sendCurrentStatus();}} >Save Status</a>
          </li>
        </div>);
    } else {
      return null;
    }
  }

  displayLogin = () => {
    if(this.state.login){
      return(
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={this.clickLogin} >Login</a>
        </li>
      );
    } else {
      return null;
    }
  }

  displaySignup = () => {
    if(this.state.signup){
      return (
        <li className="nav-item">
          <a className="nav-link"  href="" onClick={this.clickSignup} >Signup</a>
        </li>
      );
    } else { 
      return null;
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="" onClick={this.clickPiano}>Piano</a>
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
