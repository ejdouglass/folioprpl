import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import axios from 'axios';
import { load } from '../functions/globalfxns';

const Header = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
  
    function logout() {
      axios.defaults.headers.common['Authorization'] = ``;
      localStorage.removeItem('prplAppData');
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
  
        {(state.cutscene?.pending?.length > 0 && state.cutscene.current.id === -1) &&
        <div className='boingy' style={{position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '20px', right: '20px', width: '100px', height: '100px', borderRadius: '5px', backgroundColor: '#0AF'}}>
          You have cutscene.
        </div>
        }
  
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
            <button className='btn' onClick={() => history.push('/create_activity')}>Activity +!</button>
            <button className='btn' onClick={() => history.push('/body')}>Body</button>
            <button className='btn' onClick={() => history.push('/user')}>User</button>
            <button className='btn' onClick={logout}>Log Out</button>
          </>
          }
        </div>
      </div>
    )
  }

  export default Header;