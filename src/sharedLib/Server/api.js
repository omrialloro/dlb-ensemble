import { useContext, useEffect, useState } from "react";
import { serverUrl } from "../../settings";
import { AuthContext } from "../../login/authContext";

//  async function useFetch(url, options) {
//    const {
//      auth: { token },
//    } = useContext(AuthContext);
//    const fetch = (url, options) => {};
//    return fetch(serverUrl + url, {
//      ...options,
//      headers: {
//        ...options.headers,
//        Authorization: `Bearer ${token}`,
//      },
//    });
//  }

async function useSaveSession(name, data, port) {
  //  useFetch("/saveSession", {
  //    method: "POST", // or 'PUT'
  //    headers: {
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({ filename: name, data: data }),
  //  });
}

// function extractToGif(username, frames, time_ms) {
//   const prefix = window.prompt("enter gif name");
//   let name = prefix + String(Date.now());
//   let data = {
//     username: username,
//     name: name,
//     speed: Math.round(time_ms),
//     data: frames,
//     save_animation: false,
//   };
//   fetch(serverUrl + "/gif", {
//     method: "POST", // or 'PUT'
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }

//  function useExtractToGif() {
//    // const {
//    //   auth: {
//    //     payload: {
//    //       user: { email },
//    //     },
//    //   },
//    // } = useContext(AuthContext);
//    // return async function (frames, time_ms) {
//    //   const prefix = window.prompt("enter gif name");
//    //   let name = prefix + String(Date.now());
//    //   let data = {
//    //     username: email,
//    //     name: name,
//    //     speed: Math.round(time_ms),
//    //     data: frames,
//    //     save_animation: false,
//    //   };
//    //   useFetch(serverUrl + "/gif", {
//    //     method: "POST", // or 'PUT'
//    //     headers: {
//    //       "Content-Type": "application/json",
//    //     },
//    //     body: JSON.stringify(data),
//    //   });
//    //   let aaa = document.createElement(`a`);
//    //   aaa.href = serverUrl + `/download/${name}/${username}`;
//    //   aaa.click();
//    // };
//  }

function useExtractToGif() {
  const {
    auth: { token },
  } = useContext(AuthContext);
  return async function (frames, delay) {
    let data = {
      frames: frames,
      delay: delay,
    };

    fetch(serverUrl + "/gif", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      const filename = "mygif.gif";
      // response.blob().then((blob) => {
      //   const url = URL.createObjectURL(blob);
      //   console.log(url);
      //   const link = document.createElement("a");
      //   link.href = url;
      //   link.download = filename;
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      //   URL.revokeObjectURL(url);
      // });
    });
  };
}

async function useAnimationList(username) {
  // useEffect(() => {
  //   (async function () {
  //     const response = fetch(serverUrl + `/animationsList/${username}`, {
  //       method: "GET",
  //     }).then((res) => res.json());
  //   })();
  //   // let data = await fetch(port + `/animationsList/${username}`, {method: 'GET' }).then(res => res.json())
  // }, [port, username]);
}

// function saveAnimation(email, name, frames, ThumbnailFrame) {
//   let data = {
//     username: email,
//     name: name,
//     data: frames,
//     save_animation: true,
//     ThumbnailFrame: ThumbnailFrame,
//   };
//   fetch(serverUrl + "/saveAnimation", {
//     method: "POST", // or 'PUT'
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }

function useDeleteAnimationFromServer() {
  const { token } = useContext(AuthContext);
  return async function (animationId) {
    fetch(serverUrl + "/deleteStoredAnimation", {
      method: "POST", // or 'PUT'
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animationId: animationId }),
    });
  };
}

function useSaveAnimation() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    auth: { token },
  } = useContext(AuthContext);
  console.log("token", token);

  const saveAnimation = async function (data) {
    console.log(data);
    try {
      setLoading(true);
      fetch(serverUrl + "/saveAnimation", {
        // fetch(serverUrl + "/gif", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { saveAnimation, error, loading };
}

function useSaveStoredAnimations() {
  const { token } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  return async function (data) {
    try {
      setLoading(true);
      await fetch(serverUrl + "/saveStoredAnimations", {
        method: "POST", // or 'PUT'
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
}

export {
  // saveAnimation,
  // extractToGif,
  useAnimationList,
  useSaveAnimation,
  useExtractToGif,
  useDeleteAnimationFromServer,
  useSaveStoredAnimations,
};
