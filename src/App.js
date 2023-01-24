import logo from './logo.svg';
import './App.css';
import React, { useEffect,useState } from 'react';
import { BrowserRouter, Route, Routes,Link } from 'react-router-dom';
import {Login} from './login/Login'
import Editorr from './editor/Editorr'
import Creator from './creator/Creator'
import useToken from './useToken';

import { useAuth0 } from "@auth0/auth0-react";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  // console.log(loginWithRedirect())
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};


function App() {
  const { isg, error,logout } = useAuth0();
  console.log(isg)
  console.log(error)


  // useEffect(()=>{console.log(token)},[token])

  // if(!token) {
  //   console.log(token)
  //   console.log(token)
  //   console.log(token)

  //   return <Login setToken={setToken} />
  // }

  const { isAuthenticated,user } = useAuth0()

  useEffect(()=>{console.log(isAuthenticated)},[isAuthenticated,user])
 
 
  const { token, setToken } = useToken({username:user});
  const { tokenn, setTokenn } = useState({username:user});

  console.log(token)

  if(typeof user === 'undefined'){
    console.log("VVV")
  }
  else
  {
    console.log(user)
  }
  

  console.log(isAuthenticated)


  if(!isAuthenticated) {
    return (
      <>
       <LoginButton/> 
      </>
   )
  }

  else {
    console.log(user["nickname"])
  return (
  <>

    <BrowserRouter>
    <div className = "header" >
      {/* {token.username} */}
    <ul>
      <li>
      <Link to="/login">login</Link>
      </li>
      <li onClick={() => logout({ returnTo: window.location.origin })}>
      logout
      </li>
      <li>
      <Link to="/editor">editor</Link>
      </li>
      <li>
      <Link to="/creator">creator</Link>
      </li>
    </ul>  
     </div>

          <Routes >
            <Route path="/" element={<Creator token = {{username:user["nickname"],userID:user["name"]}}/>} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/editor" element={<Editorr token = {{username:user["nickname"]}}/>} />
            <Route path="/creator" element={<Creator token = {{username:user["nickname"]}}/>} />
          </Routes>
    </BrowserRouter>
  </>
  );
  }
}

export default App;
