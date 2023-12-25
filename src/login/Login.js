import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useLoginOrRegister } from "./authContext";

function Login({ setToken, isRegister, setSelected }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { loginOrRegister, error, loading } = useLoginOrRegister();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  setSelected("login");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await loginOrRegister({ email, password, isRegister });
      navigate("/creator");
    },
    [loginOrRegister, email, password, isRegister, navigate]
  );

  const isValidForm =
    email.length > 0 &&
    password.length > 0 &&
    (isRegister ? confirmation === password : true);

  const title = isRegister ? "Register new User" : "Login existing user";

  return (
    <div className="login-wrapper">
      <div className="logo-login"></div>
      <Form className="form-wrap" onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email" className="e-mail login-item">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group
          size="lg"
          controlId="password"
          className="password login-item"
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {isRegister && (
          <Form.Group size="lg" controlId="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </Form.Group>
        )}
        {isRegister ? (
          <div className="user login-item">
            Already have a user? <Link to="/login">Login</Link>
          </div>
        ) : (
          <div className="user">
            Don't have a user? <Link to="/register">Register</Link>
          </div>
        )}

        <Button
          className="login-btn"
          block
          size="lg"
          type="submit"
          disabled={!isValidForm}
        >
          {isRegister ? "Register" : "Login"}
        </Button>
      </Form>

      {loading && <div>Loading</div>}
    </div>
  );
}

export { Login };
