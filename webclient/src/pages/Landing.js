import React, { useContext, useEffect } from 'react';
import { Context } from '../context/context';
import { useHistory } from 'react-router-dom';


const Landing = () => {
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

export default Landing;