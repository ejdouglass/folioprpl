import React, { useContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import './App.css';
import { save, load, dateToString, updateDB } from './functions/globalfxns';
import { Store, Context, actions } from './context/context';
import { Button } from './components/AuthComponent'
import { events } from './events/events';

const App = () => {
  return (
    <Store>
      <Router>
        <div id='app-container'>
          <Cutscene />
          <Header />
          <div id='app-body'>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/user' component={UserPage} />
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/body' component={Body} />
            <PrivateRoute exact path='/people' component={People} />
          </div>
        </div>
      </Router>
    </Store>
  )
}


const Cutscene = () => {
  const [state, dispatch] = useContext(Context);

  // Probably add keyboard listeners to the window ONLY when cutscene is active? Can add keyboard interactivity that way, not just mouse.

  // Could consider refactoring this to have conditional rendering in the RETURN statement that checks for state?.cutscene?.current instead

  // HERE: Probably a handy useEffect that goes through and loads all the necessary details from the current cutscene event

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'fixed', zIndex: '99', visibility: state?.cutscene?.current ? 'visible' : 'hidden', width: '100vw', height: '100vh', opacity: '0.9', backgroundColor: 'white'}}>
      <h1>I am a CUTSCENE!</h1>
      <button style={{padding: '1rem', marginTop: '1rem'}}>Cool, Go Away</button>
    </div>
  )
}


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

  useEffect(() => {
    if (state?.cutscene?.current) {
      // A current cutscene has been mounted; play it out somehow
      // OR! What if we have a 'hidden' component, high z-index and fixed positioned
    }
  }, [state.cutscene])

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
          <button className='btn' onClick={() => history.push('/body')}>Body</button>
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
  const history = useHistory();

  useEffect(() => {
    if (state.token) {
      // Kinda wiggly way to do it, but turning '/' into '/home' for logged in users :P
      history.push('/home');
    }
  }, []);

  return (
    <div>
      <h1>Hey there, {state.playgroundname}.</h1>
      <p>Let me tell you a bit about Project: Playground!</p>
    </div>
  )
}


const UserPage = () => {
  const [state, dispatch] = useContext(Context);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  function submitPWChangeRequest() {
    if (oldPassword && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      const PWRequest = {oldPW: oldPassword, newPW: newPassword};
      axios.post('/user/change_pw', PWRequest)
        .then(res => {
          console.log(`Placeholder for successful PW change request`);
        })
        .catch(err => {
          console.log(`Placeholder for PW change request error`);
        })
    } else {
      alert(`Please make sure to enter your old PW, as well as a new password that matches itself in the confirmation field.`);
    }
  }

  return (
    <div style={{display: 'flex', width: '100%', alignItems: 'center', marginTop: '1rem', flexDirection: 'column'}}>
      <h1>Welcome to USER PAGE.</h1>
      <h3>This is where I'll tell you all about yourself! And maybe change your settings.</h3>
      <h3>Come to think of it, "Settings" and "User" might end up being separate concerns. That's fine!</h3>
      <h2>You can Change Password here:</h2>
      <input type='password' placeholder={'Your old password'} value={oldPassword} onChange={e => setOldPassword(e.target.value)}></input>
      <input type='password' placeholder={'Your new password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}></input>
      <input type='password' placeholder={'Confirm your new password'} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}></input>
      <button onClick={submitPWChangeRequest}>Change Password</button>
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
    <div style={{display: 'flex', flexDirection: 'column', width: '100%', marginTop: '1rem', alignItems: 'center', padding: '1rem'}}>
      <h1>Welcome home, {state.playgroundname}!</h1>
      <h2>We may now do things. Well, not yet. Soon, though!</h2>
      <h3 style={{textAlign: 'center'}}>The idea for this page is to present an interactive "core" of the PrPl experience. This is also where the first tutorial will 'load.'</h3>
      {state.encounters?.tabula_rasa === 0 && 
      <>
        <h1>What a TREAT! Your adventure is beginning right now!</h1>
        <button style={{padding: '0.8rem'}} onClick={() => dispatch({type: actions.MOUNT_CUTSCENE, payload: events.introduction})}>BEGIN</button>
      </>
      }
    </div>
  )
}


const Body = () => {
  const [state, dispatch] = useContext(Context);
  const [activityName, setActivityName] = useState('');
  const [activityAmt, setActivityAmt] = useState(0);
  const [activityType, setActivityType] = useState('');
  const mounted = useRef(false);

  function addActivity() {
    if (activityName && activityAmt > 0 && activityType) {
      const newActivity = {name: activityName, amount: activityAmt, type: activityType};
      const today = dateToString();
      dispatch({type: actions.ADD_ACTIVITY, payload: {activity: newActivity, date: today}});
      setActivityName('');
      setActivityAmt(0);
      setActivityType('');
    }
  }

  useEffect(() => {
    // Good enough for now to avoid an extra DB push on component mounting
    if (!mounted.current) {
      mounted.current = true;
    } else {
      console.log(`I feel the need to update the backend with new STUFF!`);
      save(state);
      updateDB(state);
    }
    
  }, [state]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
      <h1>Add an Activity</h1>
      <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', height: '300px', width: '300px', border: '1px solid #444', alignItems: 'center', padding: '1rem 0'}}>
        <input type='text' style={{padding: '1rem', fontSize: '0.8rem', width: '200px'}} placeholder={'activity name'} value={activityName} onChange={e => setActivityName(e.target.value)}></input>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '60%'}}>
          <input type='number' placeholder={'amt'} style={{marginTop: '1rem', padding: '1rem', width: '80px'}} value={activityAmt} onChange={e => setActivityAmt(e.target.value)} ></input>
          <input type='text' placeholder={'type'} style={{marginTop: '1rem', padding: '1rem', width: '80px'}} value={activityType} onChange={e => setActivityType(e.target.value)} ></input>
        </div>
        <Button onClick={addActivity} style={{marginTop: '1rem'}}>Add Activity</Button>
      </div>
    </div>
  )
}


const People = () => {
  return (
    <div>
      <h1>Find People Here!</h1>
    </div>
  )
}

export default App;
