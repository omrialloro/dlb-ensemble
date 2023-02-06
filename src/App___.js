import logo from './logo.svg';
import './App.css';
import React, { useEffect,useState } from 'react';


import { useAuth0 } from "@auth0/auth0-react";

function App() {

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const domain = "dev-d7jkvin4dqkh56p1.us.auth0.com"

  const data = { username: 'example' };

  


  useEffect(() => {
    const getUserMetadata = async () => {
  try {
    // const accessToken = await getAccessTokenSilently({
    //   audience: `https://localhost:4000/api`,
    //   scope: "read:current_user",
    // });
    const accessToken = await getAccessTokenSilently();


    console.log(accessToken)

    const userDetailsByIdUrl = `https://localhost:4000/api/timesheets/upload`;

    const metadataResponse = await fetch(userDetailsByIdUrl, {
      method: 'POST', 
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    console.log("vvvvvv")
    console.log("vvvvvv")
    console.log("vvvvvv")
    console.log("vvvvvv")


    const { user_metadata } = await metadataResponse.json();

    setUserMetadata(user_metadata);
  } catch (e) {
    console.log(e.message);
  }
};

getUserMetadata();
}, [getAccessTokenSilently, user?.sub]);





  // fetch('https://localhost:4000/timesheets/upload', {
  //   method: 'POST', // or 'PUT'
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log('Success:', data);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });






  return (
  <>

  </>
  );
  }


export default App;
