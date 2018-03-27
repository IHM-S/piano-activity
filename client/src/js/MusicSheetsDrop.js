import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "client/static/MusicSheetsDrop.css";

const GET_ALL_MUSIC_SHEETS = 'http://localhost:5000/getallsheets';

// thhis class renders the drop down list in the Navbar
export default withRouter(class MusicSheetsDrop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      sheetsList: []
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount(){
    fetch(GET_ALL_MUSIC_SHEETS)
    .then(response => response.json())
    .then((data) => {
      console.log("get all music sheets");
      console.log(data);
      this.setState({ sheetsList : data.musicSheetNames});
    });
  }


  render() {
    return (
      <div className="myDrop">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Music Sheets
          </DropdownToggle>
          <DropdownMenu className="myMenu">
            <DropdownItem header>Sheet Names</DropdownItem>
            {this.state.sheetsList.map((e, idx) => {
              return(
                <DropdownItem key={idx}>
                  <Link key={idx} to={{
                    pathname: '/main',
                    state: { sheetName: e }
                  }}> {e} </Link>
                </DropdownItem>)
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
})