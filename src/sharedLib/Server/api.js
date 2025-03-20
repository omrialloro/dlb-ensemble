import { useContext, useEffect, useState } from "react";
import { serverUrl } from "../../settings";
import { AuthContext } from "../../login/authContext";
import { useFetch } from "./useFetch";

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
  return async function (frames, delay, width, height, pixelConfig) {
    let data = {
      frames,
      delay,
      width,
      height,
      pixelConfig,
    };

    let gifId = await fetch(serverUrl + "/gif", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    let gifUrl = gifPath + gifId + ".gif";

    downloadGif(gifUrl, `${gifId}.gif`);
  };
}

function useDeleteAnimationFromServer() {
  const {
    auth: { token },
  } = useContext(AuthContext);
  return async function (animationId) {
    fetch(serverUrl + "/markAsDeleted", {
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

  const saveAnimation = async function (data) {
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

function useAnimationFromServer(type) {
  const { data, error, loading } = useFetch(
    `/animationsList?type=${type}`,
    true
  );
  const thumbnailsUrl = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/";
  const [animationsServer, setAnimationsServer] = useState([]);

  useEffect(() => {
    if (!data || error) return;
    let animations_ = [];
    for (let i = 0; i < data["names"].length; i++) {
      let id = data["ids"][i];
      animations_.push({
        id: id,
        name: data["names"][i],
        imgUrl: thumbnailsUrl + String(id) + ".png",
        isChecked: false,
      });
    }
    setAnimationsServer(animations_);
  }, [data]);
  return animationsServer;
}
function useLoadAnimation() {
  const {
    auth: { token },
  } = useContext(AuthContext);
  async function loadAnimation(animationId) {
    console.log(serverUrl);
    const res = await fetch(serverUrl + `/loadAnimation/${animationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res.json();
  }
  return loadAnimation;
}

const UploadMp3 = (props) => {
  const {
    auth: { token },
  } = useContext(AuthContext);
  const setMusicUrl = props.setMusicUrl;
  // const [musicUrl, setMusicUrl] = useState("");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "audio/mpeg") {
      console.log(selectedFile);
      setFile(selectedFile);
      // setMessage("");
    }
    //  else {
    //   setMessage("Please select a valid MP3 file.");
    // }
  };
  useEffect(() => {
    console.log(file);
  }, [file]);

  const handleUpload = async () => {
    // if (!file) {
    //   setMessage("No file selected.");
    //   return;
    // }

    // setUploading(true);
    // setMessage("");

    // const formData = new FormData();
    // formData.append("file", file);

    // console.log(file);
    // console.log(formData["file"]);

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value); // This will log the key-value pairs of the FormData
    // }

    // try {
    //   const response = await fetch(serverUrl + "/uploadFile", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: formData,
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     setMusicUrl(data.fileUrl);
    //     setMessage(`File uploaded successfully! URL: ${data.fileUrl}`);
    //   } else {
    //     setMessage("Upload failed. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Upload error:", error);
    //   setMessage("Upload failed. Please try again.");
    // }

    // setUploading(false);
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    // 🚀 Log file details
    console.log("File Object:", file);
    console.log("File Name:", file.name);
    console.log("File Type:", file.type);
    console.log("File Size:", file.size, "bytes");

    // 🚀 Log FormData contents correctly
    for (let entry of formData.entries()) {
      console.log("FormData Key:", entry[0], "Value:", entry[1]);
    }

    try {
      const response = await fetch(serverUrl + "/uploadFile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Only set auth header
        },
        body: formData, // ✅ Correctly sends file as FormData
      });

      const data = await response.json();

      if (response.ok) {
        setMusicUrl(data.fileUrl);
        setMessage(`File uploaded successfully! URL: ${data.fileUrl}`);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="audio/mpeg" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload MP3"}
      </button>
    </div>
  );
};

export {
  useSaveAnimation,
  useExtractToGif,
  useDeleteAnimationFromServer,
  useSaveStoredAnimations,
  useAnimationFromServer,
  useLoadAnimation,
  UploadMp3,
};
