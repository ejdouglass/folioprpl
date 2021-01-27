import React from "react";
import { Link } from 'react-router-dom';
import { Card, LogoBlock, Form, Input, Button } from '../components/AuthComponent';

function Register() {
  return (
    <Card>
      <LogoBlock />
      <Form>
        <Input type="email" placeholder="Please enter your email" />
        <Input type="password" placeholder="Please select a password" />
        <Input type="password" placeholder="Please confirm your password" />
        <Button>Register</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
    </Card>
  );
}

export default Register;