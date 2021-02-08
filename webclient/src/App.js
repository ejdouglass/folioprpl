import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Cutscene from './pages/Cutscene';
import Header from './pages/Header';
import Body from './pages/Body';
import Landing from './pages/Landing';
import Login from './pages/Login';
import UserSettings from './pages/UserSettings';
import Home from './pages/Home';
import Register from './pages/Register';
import CreateActivity from './pages/CreateActivity';
import './App.css';
import { Store } from './context/context';

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


const People = () => {
  return (
    <div>
      <h1>Find People Here!</h1>
    </div>
  )
}

export default App;

/*
  NEW RULE: Let's just throw new pages and such into their own proper place up-front, save a lotta refactoring rejiggeirng later.

  And for now, we'll leave some general App Notes here for perusal/reference. 

*/