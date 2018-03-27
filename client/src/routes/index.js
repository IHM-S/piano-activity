import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import SignUp from 'client/js/SignUp';
import Login from 'client/js/Login';
import Main from 'client/js/Main';
import Result from 'client/js/Result';
import NewSheet from 'client/js/NewSheet';

// this function is the react route, it redirect pages.
export default () => (
  <BrowserRouter>
    <Switch>
        <Route exact path="/"         render={props => <Main     {...props}/>} />
        <Route exact path="/signup"   render={props => <SignUp   {...props}/>} />
        <Route exact path="/login"    render={props => <Login    {...props}/>} />
        <Route exact path="/main"     render={props => <Main     {...props}/>} />
        <Route exact path="/result"   render={props => <Result   {...props}/>} />
        <Route exact path="/newsheet" render={props => <NewSheet {...props}/>} />
    </Switch>
  </BrowserRouter>)