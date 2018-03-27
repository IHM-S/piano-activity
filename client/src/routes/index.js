import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Main from './Main';
import Result from './Result';
import NewSheet from './NewSheet';

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