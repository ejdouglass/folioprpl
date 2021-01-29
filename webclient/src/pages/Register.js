import React, { useState } from "react";
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Card, LogoBlock, Form, Input, HalfInput, Button } from '../components/AuthComponent';

function Register() {
  const [email, setEmail] = useState('');
  const [pgName, setPgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const history = useHistory();

  function registerNewUser() {
    let errorFeedback = '';

    // Add more checks, like empty spaces in any of it, and maybe length checks, and more robust email format checks
    if (!email) errorFeedback += `Please enter an email to user as your login account. `;
    if (email.indexOf('@') === -1 && errorFeedback.length === 0) errorFeedback += `Please enter an actual email address. `;
    if (email.indexOf('.') === -1 && errorFeedback.length === 0) errorFeedback += `Please enter an actual email address. `;
    if (!password.length) errorFeedback += `Enter a password to use. `;
    if (!confirmedPassword.length && password.length) errorFeedback += `Please re-enter your password in the confirmation field. `;
    if (password !== confirmedPassword && password.length && confirmedPassword.length) errorFeedback += `Your password doesn't match itself. Identity crisis? `;
    if (!pgName) errorFeedback += `Please enter a name to use as your Playground username. `;

    if (errorFeedback) alert(errorFeedback)
    else {
      // Creating a backend-friendly version of these variables to send in the request
      const newUserCredentials = {
        email: email,
        password: password,
        playgroundname: pgName
      };
  
      // Add a catch for "success" where we save the user's STUFF, incl. token, to global state; maybe add a Header useEffect that puts token in auth header(s)
      //    via axios default
      // Oh, and boop onto the HOME page. You're home! See your STUFF!
      axios.post('/user/register', newUserCredentials)
        .then(res => {
          console.log(`Server sez: ${res.data.message} and presents you with this token: ${res.data.token}!`);
          // HERE: Update global state ... which requires an update to Reducer, obviously
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          history.push('/');
        })
        .catch(err => console.log(`Oopsie: ${err}`));
      }
    
  }

  return (
    <Card>
      <LogoBlock />
      <Form>
        <Input type="email" placeholder="Please enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <div className='flex flex-row' style={{justifyContent: 'space-between'}}>
          <HalfInput type="password" placeholder="Enter a password" value={password} onChange={e => setPassword(e.target.value)} />
          <HalfInput type="password" placeholder="Confirm password" value={confirmedPassword} onChange={e => setConfirmedPassword(e.target.value)} />
        </div>
        <Input type="text" placeholder="Please enter the username you'd like others to see" value={pgName} onChange={e => setPgName(e.target.value)} />
        <Button onClick={registerNewUser}>Register</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
    </Card>
  );
}

export default Register;