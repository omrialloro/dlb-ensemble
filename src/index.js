import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
  domain="dev-d7jkvin4dqkh56p1.us.auth0.com"
  clientId="IvYVAyqX6jAntmqBlVCXrAlKvi52gOj1"
  redirectUri={window.location.origin}
  // audience="https://dev-d7jkvin4dqkh56p1.us.auth0.com/api/v2/"
    audience="http://localhost:4000/api"

  scope="read:current_user update:current_user_metadata"
>
    <App />
    </Auth0Provider>
);

// <React.StrictMode>
// </React.StrictMode>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
