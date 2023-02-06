import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import "./Login.css";


async function loginUser(credentials) {
  console.log(JSON.stringify(credentials))
  return fetch('https://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
    // .then(data => data.json())
    // .then(data => credentials)


 }
 

function Login({setToken}) {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
    setToken({token:{
      username,
      password
    }});

  }


  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  return (

    <div className="login-wrapper">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>username</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}

export {Login}



