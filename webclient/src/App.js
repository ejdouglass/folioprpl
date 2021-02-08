import React, { useContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Cutscene from './pages/Cutscene';
import Header from './pages/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import UserSettings from './pages/UserSettings';
import Home from './pages/Home';
import Register from './pages/Register';
import CreateActivity from './pages/CreateActivity';
import './App.css';
import { save, dateToString, updateDB } from './functions/globalfxns';
import { Store, Context, actions } from './context/context';
import { Button } from './components/AuthComponent'

const App = () => {
  return (
    <Store>
      <Router>
        <div id='app-container'>
          <Cutscene />
          <Header />
          <div id='app-body'>
            <Route exact path='/' component={Landing} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/user' component={UserSettings} />
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/body' component={Body} />
            <PrivateRoute exact path='/create_activity' component={CreateActivity} />
            <PrivateRoute exact path='/people' component={People} />
          </div>
        </div>
      </Router>
    </Store>
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
