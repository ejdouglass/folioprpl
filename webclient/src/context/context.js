import React, { createContext, useReducer } from 'react';

export const actions = {
    LOAD_USER: 'load_user',
    LOGOUT: 'logout',
    ADD_ACTIVITY: 'add_activity'
}

const Reducer = (state, action) => {
    switch (action.type) {
        case actions.LOAD_USER:
            // Shoouuuuuld be receiving a user object with all the relevant stats. Haven't stress-tested it thoroughly yet, though.
            return action.payload;
        case actions.LOGOUT:
            return initialState;
        case actions.ADD_ACTIVITY:
            // Receiving an object payload: {activity: {}, date: 'mmddyyyy'}
            let historyCopy = JSON.parse(JSON.stringify(state.history));
            if (!historyCopy[action.payload.date]) {
                console.log(`This date has nothing in it yet! Lemme fix that real quick...`);
                historyCopy[action.payload.date] = {
                    planned: [],
                    completed: []
                }
            }
            historyCopy[action.payload.date].completed.push(action.payload.activity);
            return {...state, history: historyCopy};
        default:
            console.log(`Dispatch called the Reducer, but for whatever reason, we're executing the default. Returning state.`);
            return state;
    }
}

/*
Let's figure out what kind of state-y things we want to track globally
... and what sorts of things we broadly want to track, but local might be fine
... currently, this is all just user data, and conveniently can just be 1-to-1 matched with the backend DB for ease for now

      Thoughts on Stuff to ADD or EXPAND:
    -- whatDo, which keeps state-centric tabs on where the user is on the site and what they're engaged with (in case crash or leaving or whatnot)
*/
const initialState = {
    playgroundname: 'Esteemed Guest',
    token: undefined,
    history: {},
    birthday: undefined,
    lab: {},
    encounters: {},
    library: {},
    joined: undefined,
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