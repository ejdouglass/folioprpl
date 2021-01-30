import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import './App.css';
import { Store, Context } from './context/context';

const App = () => {
  return (
    <Store>
      <Router>
        <div id='app-container'>
          <Header />
          <div id='app-body'>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/user' component={UserPage} />
          </div>
        </div>
      </Router>
    </Store>
  )
}


const Header = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div className='flex-centered flex-col' id='app-header'>
      <div>
        <h1>APP HEADER, hiya</h1>
      </div>
      <div className='flex flex-row'>
        <button className='btn' onClick={() => history.push('/')}>Home</button>
        <button className='btn' onClick={() => history.push('/user')}>User</button>
        <button className='btn' onClick={() => history.push('/login')}>Log In</button>
        <button className='btn' onClick={() => history.push('/register')}>Register</button>
      </div>
    </div>
  )
}


const LandingPage = () => {
  const [state, dispatch] = useContext(Context);

  function checkBackendAuth() {
    axios.get('/auth_check')
      .then(res => console.log(`I checked the backend. I got this message: ${res.data.message}`))
      .catch(err => console.log(`Checking backend auth failed, error: ${err}`));
  }

  return (
    <div>
      <h1>Hey there, {state.playgroundname}.</h1>
      <button onClick={checkBackendAuth}>BOOP ME TO CHECK BACKEND AUTH</button>
    </div>
  )
}


const UserPage = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <h1>Welcome to USER PAGE.</h1>
    </div>
  )
}

export default App;
