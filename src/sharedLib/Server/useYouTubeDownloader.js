import { useState, useContext } from "react";
import { serverUrl } from "../../settings";
import { AuthContext } from "../../login/authContext";

const useYouTubeDownloader = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    auth: { token },
  } = useContext(AuthContext);

  const downloadAudio = async (url) => {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch(serverUrl + `/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (response.ok) {
        setAudioUrl(data.url);
      } else {
        setError(data.error || "Error occurred");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return { audioUrl, loading, error, downloadAudio };
};

export default useYouTubeDownloader;
