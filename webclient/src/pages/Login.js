import React, { useState, useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import { actions, Context } from '../context/context';
import axios from 'axios';
import { save } from '../functions/globalfxns';
import { Card, LogoBlock, Form, Input, Button } from '../components/AuthComponent';

function Login() {
  const [state, dispatch] = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  function loginUser() {
    let loginCredentials = {email: email, password: password};
    axios.post('/user/login', loginCredentials)
      .then(res => {
        // ADD: An extra check, because right now ANY response is considered 'success' here :P
        if (res.data.success) {
          console.log(`Login successful, we have logged in ${JSON.stringify(res.data.user)}`)
          dispatch({type: actions.LOAD_USER, payload: res.data.user});
          save(res.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.token}`;
          console.log(`Full user deets logged in: ${JSON.stringify(res.data.user)}`)
          history.push('/home');
        } else {
          alert(`Whoops. ${res.data.message}`);
        }
      })
      .catch(err => console.log(`Error logging in: ${err}`));
  }

  return (
    <Card>
      <LogoBlock />
      <Form>
        <Input type="email" autoFocus={true} placeholder="Please enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Your password, please" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={loginUser}>Log In</Button>
      </Form>
      <Link to="/register">Don't have an account?</Link>
    </Card>
  );
}

export default Login;