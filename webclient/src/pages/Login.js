import React from "react";
import { Link } from 'react-router-dom';
import { Card, LogoBlock, Form, Input, Button } from '../components/AuthComponent';

function Login() {
  return (
    <Card>
      <LogoBlock />
      <Form>
        <Input type="email" placeholder="email" />
        <Input type="password" placeholder="password" />
        <Button>Log In</Button>
      </Form>
      <Link to="/register">Don't have an account?</Link>
    </Card>
  );
}

export default Login;