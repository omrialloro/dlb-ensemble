import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import "./Login.css";

function Login({ setToken, isRegister }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const token = await loginUser({
        username,
        password,
        isRegister,
      });
    } else {
    }
    setToken(token);
    setToken({
      token: {
        username,
        password,
      },
    });
  };

  function validateForm() {
    return (
      username.length > 0 &&
      password.length > 0 &&
      isRegister &&
      confirmation === password
    );
  }

  const title = isRegister ? "Register new User" : "Login existing user";

  return (
    <div className="login-wrapper">
      <h1>{title}</h1>
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
        {isRegister && (
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </Form.Group>
        )}
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          {isRegister ? "Register" : "Login"}
        </Button>
      </Form>
    </div>
  );
}

export { Login };
