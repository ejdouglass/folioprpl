import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import styled from 'styled-components'; // Test run of this wackiness
import './App.css';

const Reducer = (action, state) => {
  switch (action.type) {
    default:
      return state;
  }
}

const initialState = {
  name: 'Mr. EJD'
}

const Context = createContext(initialState);

const Store = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}

const App = () => {
  return (
    <Store>
      <Router>
        <Header />
        <div id='app-body'>
          <Route exact path='/' component={LandingPageComponent} />
        </div>
      </Router>
    </Store>
  )
}


const Header = () => {
  return (
    <div>
      <h1>(APP HEADER)</h1>
    </div>
  )
}


const LandingPageComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <h1>Hey there, {state.name}.</h1>
    </div>
  )
}

export default App;
