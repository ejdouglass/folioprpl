import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import './App.css';
import { save, load } from './functions/globalfxns';
import { Store, Context, actions } from './context/context';

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
            <PrivateRoute exact path='/home' component={Home} />
          </div>
        </div>
      </Router>
    </Store>
  )
}


const Header = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  function logout() {
    axios.defaults.headers.common['Authorization'] = ``;
    dispatch({type: actions.LOGOUT});
    history.push('/login');
  }

  useEffect(() => {
    // Header's first load fires this off, which is when the app has just opened.
    const initLoadAppData = load();
    if (initLoadAppData !== null) {
      dispatch({type: actions.LOAD_USER, payload: initLoadAppData});
      axios.defaults.headers.common['Authorization'] = `Bearer ${initLoadAppData.token}`;
      history.push('/home');
    }
    // NOTE: It may make a lot more sense just to pop this code into the index.js file instead. The framework for this method is commented out over there.
  }, [dispatch, history]);

  return (
    <div className='flex-centered flex-col' id='app-header'>
      <div>
        <h1>Project : Playground</h1>
      </div>
      <div className='flex flex-row'>
        {!state.token &&
        <>
          <button className='btn' onClick={() => history.push('/')}>What's This?</button>
          <button className='btn' onClick={() => history.push('/login')}>Log In</button>
          <button className='btn' onClick={() => history.push('/register')}>Register</button>
        </>
        }
        {state.token &&
        <>
          <button className='btn' onClick={() => history.push('/home')}>Home</button>
          <button className='btn' onClick={() => history.push('/user')}>User</button>
          <button className='btn' onClick={logout}>Log Out</button>
        </>
        }
      </div>
    </div>
  )
}


const LandingPage = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <h1>Hey there, {state.playgroundname}.</h1>
      <p>Let me tell you a bit about Project: Playground!</p>
    </div>
  )
}


const UserPage = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <h1>Welcome to USER PAGE.</h1>
      <h3>This is where I'll tell you all about yourself! And maybe change your settings.</h3>
      <h3>Come to think of it, "Settings" and "User" might end up being separate concerns. That's fine!</h3>
    </div>
  )
}


const Home = () => {
  const [state, dispatch] = useContext(Context);

  // HERE: We should only be here if we're logged in, so let's slap a useEffect down.
  /*
    About the useEffect:
    -- This is ideally where the user will land when they log in each new day. (Maybe have a lastInteractDate so the Header can check as the user does stuff?)
    -- 
  */
  useEffect(() => {
    // Initial load effects
  }, []);

  return (
    <div>
      <h1>Welcome home, {state.playgroundname}!</h1>
      <h2>We may now do things. Well, not yet. Soon, though!</h2>
      <h3>The idea for this page is to present an interactive "core" of the PrPl experience. This is also where the firs tutorial will 'load.'</h3>
    </div>
  )
}

export default App;
