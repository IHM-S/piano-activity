import React, { Component } from 'react';
import { withRouter } from 'react-router';
import MusicSheetsDrop from './MusicSheetsDrop'

export default withRouter(class Navbar extends Component {
  constructor(props){
    super(props);
    console.log("Navbar");
    console.log(props);
    this.state = {
      addNewMusic : this.props.addNewMusic ? true : false,
      logout : this.props.logout ? true : false,
      musicSheets : this.props.musicSheets ? true : false
    }
  }

  clickLogout = () => {
    console.log("click logout")
    localStorage.removeItem("pianoSession");
    this.props.history.push({
      pathname : '/login'
    });
  }

  clickPiano = () => {
    console.log("click piano")
    this.props.history.push({
      pathname : '/main'
    });
  }

  clickAdd = () => {
    console.log("click add new sheet")
    this.props.history.push({
      pathname : '/newsheet'
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

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="" onClick={this.clickPiano}>Piano</a>
            <ul className="navbar-nav">
              {this.displayAddNewMusic()}
              {this.dsiplayLogout()}
              {this.displayMusicSheets()}
            </ul>
        </nav>
      </div>
    )
  }
})
