// import logo from './logo.svg';
// import './App.css';

// import { useAuth0 } from "@auth0/auth0-react";

// const port = "http://localhost:6060"
// function App() {
//   const { getAccessTokenSilently } = useAuth0();

             
//   async function fff(){
//     const token = await getAccessTokenSilently();
//     fetch(port + '/check', {
//       method: 'GET', // or 'PUT'
//       headers: {
//         Authorization: `Bearer ${token}`,}
//     })
//   }



  // const LogoutButton = () => {
  //   const { logout } = useAuth0();
  
  //   return (
  //     <button onClick={() => logout({ returnTo: window.location.origin })}>
  //       Log Out
  //     </button>
  //   );
  // };
//   const { isAuthenticated,user } = useAuth0()

//   const LoginButton = () => {
//     const { loginWithRedirect } = useAuth0();
//     // console.log(loginWithRedirect())
//     return <button onClick={() => loginWithRedirect()}>Log In</button>;
//   };
//   return (
//     <div className="App">
//       {isAuthenticated?<>
//       <div onClick={fff}>
//       fdfdf
//       </div>
//       <LogoutButton/>
//         </>
//      :<LoginButton/>}
      
//     </div>
//   );
// }
import logo from './logo.svg';
import './App.css';
import React, { useEffect,useState } from 'react';




import { useAuth0 } from "@auth0/auth0-react";


const port = "http://localhost:6060"

// const port = "https://18.193.175.134:6060"


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
  const { getAccessTokenSilently } = useAuth0();

  const { isAuthenticated,user } = useAuth0()
  async function fff(){
    const token = await getAccessTokenSilently();
    fetch(port + '/check', {
      method: 'GET', // or 'PUT'
      headers: {
        Authorization: `Bearer ${token}`,}
    })
  }

  useEffect(()=>{console.log(isAuthenticated)},[isAuthenticated,user])
 


  if(!isAuthenticated) {
    return (
      <>
       <LoginButton/> 
      </>
   )
  }

  else {
  return (
  <>
   <div onClick={fff}>
       fdfdf
      </div>
       <LogoutButton/>
  </>
  );
  }
}

export default App;
