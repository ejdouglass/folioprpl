import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
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

  return (
    <div>
      <h1>Hey there, {state.name}.</h1>
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
