import { useContext, useEffect, useState } from "react";
import { serverUrl } from "../../settings";
import { AuthContext } from "../../login/authContext";

const gifPath = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/gifs/ooo";

function downloadGif(url, filename) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";

  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
  };

  xhr.send();
}

function useExtractToGif() {
  const {
    auth: { token },
  } = useContext(AuthContext);
  return async function (frames, delay) {
    let data = {
      frames,
      delay,
    };

    let gifId = await fetch(serverUrl + "/gif", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    console.log(gifId);

    let gifUrl = gifPath + gifId + ".gif";
    console.log(gifUrl);

    downloadGif(gifUrl, `${gifId}.gif`);
  };
}

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
  useSaveAnimation,
  useExtractToGif,
  useDeleteAnimationFromServer,
  useSaveStoredAnimations,
};
