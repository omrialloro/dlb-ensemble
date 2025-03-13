import { useEffect, useState } from "react";

function YoutubeDownloader(props) {
  const setUrl = props.setUrl;
  const [videoId, setVideoId] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log(downloadLink);
  }, [downloadLink]);

  const fetchDownloadLink = async () => {
    setError(null);
    setDownloadLink(null);

    if (!videoId) {
      setError("Please enter a video ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/downloadYoutubeMp3?id=${videoId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch download link.");
      }

      setDownloadLink(data.data.link);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>YouTube MP3 Downloader</h2>
      <input
        type="text"
        placeholder="Enter Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
      />
      <button onClick={fetchDownloadLink}>Download</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {downloadLink && (
        <p>
          Download:{" "}
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            Click here
          </a>
        </p>
      )}
    </div>
  );
}

export default YoutubeDownloader;
