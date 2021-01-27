import React, { createContext, useReducer } from 'react';

const Reducer = (action, state) => {
    switch (action.type) {
        default:
        return state;
    }
}

/*
Let's figure out what kind of state-y things we want to track globally
... and what sorts of things we broadly want to track, but local might be fine
*/
const initialState = {
    name: 'Mr. EJD',
    user: '',
    nickname: '',
    history: {},
    isAuthenticated: false
}

export const Context = createContext(initialState);

export const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
        {children}
        </Context.Provider>
    )
}