import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import SignUp from './SignUp'
import Login from './Login'
import Test from './Test'
import Main from './Main'
import Result from './Result'


export default () => (
  <BrowserRouter>
    <Switch>
        <Route exact path="/"        render={props => <SignUp {...props}/>} />
        <Route exact path="/signup"  render={props => <SignUp {...props}/>} />
        <Route exact path="/login"   render={props => <Login  {...props}/>} />
        <Route exact path="/test"    render={props => <Test   {...props}/>} />
        <Route exact path="/main"    render={props => <Main   {...props}/>} />
        <Route exact path="/result"  render={props => <Result {...props}/>} />
    </Switch>
  </BrowserRouter>)