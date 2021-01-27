import React, { Component, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from './context/context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [state] = useContext(Context);

    return (
        <Route 
            {...rest} 
            render={(props => 
            state.isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to='/login' />
            )
        )}
        />
    )
}

export default PrivateRoute;