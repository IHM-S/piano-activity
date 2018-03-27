import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Navbar from './Navbar';
import './Login.css';

const LOGIN = 'http://localhost:5000/userlogin'
const CHECK_SESSION = 'http://localhost:5000/checksession'

// this class renders the login page
export default withRouter(class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userName: '',
        password: '',
        message: (this.props.location.state && this.props.location.state.message) ? this.props.location.state.message : null
    }
    console.log("State of Login");
    console.log(this.state);
    console.log("Props of Login");
    console.log(this.props);
  }

  login = () => {
    // if username and password match regex then pass them into backend
    if (/^[a-zA-Z0-9_]{4,15}$/.test(this.state.userName) && /^[a-zA-Z0-9_.,!@#$%]{6,16}$/.test(this.state.password)) {
      fetch(LOGIN, {
        'body': JSON.stringify(
          {
            'userName'  : this.state.userName,
            'password'  : this.state.password,
          }),
          'cache': 'no-cache',
          'headers': {
                      'content-type': 'application/json'
                      },
          'method': 'POST'
      }).then((response) => response.json()).then((response) => {
        if(response.userExistence){ // successfully login a new user, redirect to start page
          localStorage.setItem('pianoSession', response.session);
          localStorage.setItem('pianoUserName', response.userName);
          this.props.history.push({
            pathname : '/main',
            state: {message: "successfully login"}
          })
        } else { // username doesn't exist or username or password is wrong.
          this.setState({message: "Username doesn't exist or username or password is wrong."});
        }
      }).catch((err) => { // server side wrong
        this.setState({message: 'Unable to connect to the server.'});
      });
    } else { // username or password doesn't match regex
      this.setState({message: "UserName or password doesn't match corresponded regex."});
    } 
  }

  componentDidMount(){ // after first time component is mounted
    let session = localStorage.getItem("pianoSession");
    if(session) { // if session is defined
      fetch(CHECK_SESSION, { //  check if session is valid
        'body': JSON.stringify(
          {
            'session' : session
          }),
          'cache': 'no-cache',
          'headers': {
                      'content-type': 'application/json'
                      },
          'method': 'POST'
      }).then((response) => response.json()).then((response) => {
        if(response.userExistence) {
          // redirect to start page because user already has an session
          console.log("session is correct");
          localStorage.setItem("state", "correct");
          this.props.history.push({
            pathname : '/test',
            state: {message: "successfully login."}
          });
        } else { // session is incorrect
          console.log("session is incorrect");
          localStorage.setItem("state", "incorrect");
          localStorage.removeItem("pianoSession");
          this.setState({message: 'Session is incorrect.'});
        }
      }).catch((err) => { // server side error
        console.log("server is down");
        localStorage.setItem("state", "down");
        localStorage.removeItem("pianoSession");
        this.setState({message: 'Unable to connect to the server.'});
      });
    }
    // if session is not defined, do nothing 
  }

  render() {
    // doesn't matter what the state is firstly render the page
    console.log("message")
    console.log(this.state.message)
    return(
      <div>
        <Navbar signup={true}/>
        <div className="wrapper" onSubmit={(e) => {e.preventDefault(); this.login();}}> 
          <form className="form-signin">
            <h2 className="form-signin-heading">Piano Act</h2>
            <input type="text" className="form-control" onChange={(e) => {this.setState({'userName' : e.target.value}); console.log("userName: " + this.state.userName);}}  name="username" placeholder="Username: [a-zA-Z0-9_]{4, 15}" required="true" autoFocus="" />
            <input type="password" className="form-control" onChange={(e) => {this.setState({'password' : e.target.value}); console.log("password: " + this.state.password);}} name="password" placeholder="Password: [a-zA-Z0-9_.,!@#$%]{6, 16}" required="true"/>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            <p>{this.state.message}</p>
          </form>
        </div>
      </div>
    )
  }
})

