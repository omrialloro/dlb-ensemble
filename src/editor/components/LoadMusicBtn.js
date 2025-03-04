import { useState } from "react";
import useYouTubeDownloader from "./../../sharedLib/Server/useYouTubeDownloader";

function LoadMusicBtn() {
  const [url, setUrl] = useState("");
  const { audioUrl, loading, error, downloadAudio } = useYouTubeDownloader();

  const handleSubmit = (e) => {
    e.preventDefault();
    downloadAudio(url);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>YouTube to MP3</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Downloading..." : "Download"}
        </button>
      </form>
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {audioUrl && (
        <div>
          <p>Download your audio:</p>
          <a href={audioUrl} target="_blank" rel="noopener noreferrer">
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
}

export default LoadMusicBtn;
