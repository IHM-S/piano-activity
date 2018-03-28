import React, { Component } from 'react';
import { withRouter } from 'react-router'
import Navbar from './Navbar'
import '../static/SignUp.css';

const SIGNIN = 'http://localhost:5000/usersignin'

export default withRouter(class SignUp extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: '',
        password: '',
        message: null
      };
    }

    signUp = () => {
      // if username and password match regex then pass them into backend
      if (/^[a-zA-Z0-9_]{4,15}$/.test(this.state.userName) && /^[a-zA-Z0-9_.,!@#$%]{6,16}$/.test(this.state.password)) {
        fetch(SIGNIN, {
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
          if (response.succeed) { // successfully create a new user, redirect to login page
            this.props.history.push({
              pathname : '/login',
              state: {message: "You have created your account now, please login."}
            })
          } else { // username already exist
            this.setState({message: 'UserName already exist.'});
          }
        }).catch((err) => { // server side wrong
          this.setState({message: 'Unable to connect to the server.'});
        });
      } else { // username or password doesn't match regex
        this.setState({message: "UserName or password doesn't match corresponded regex."});
      } 
    };

    render() {
      return (
        <div>
          <Navbar login={true}/>
          <div className="wrapper" onSubmit={(e) => {e.preventDefault(); this.signUp();}}>
            <form className="form-signin">
              <h2 className="form-signin-heading">Sign up form</h2>
              <input type="text" className="form-control" 
                onChange={(e) => {this.setState({'userName' : e.target.value});}}  name="username" 
                placeholder="Username" required="true" autoFocus="" />
              <input type="password" className="form-control" 
                onChange={(e) => {this.setState({'password' : e.target.value});}} name="password" 
                placeholder="Password" required="true"/>
              <button className="btn btn-lg btn-primary btn-block" type="submit">SignUp</button>
              <p>{this.state.message}</p>
            </form>
          </div>
        </div>
      )
    }
})
