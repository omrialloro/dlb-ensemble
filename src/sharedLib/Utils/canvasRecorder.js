const MIME_CANDIDATES = [
  "video/mp4;codecs=avc1",
  "video/mp4",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
];

function pickSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const type of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function extensionForMimeType(mimeType) {
  return mimeType.startsWith("video/mp4") ? "mp4" : "webm";
}

function createCanvasRecorder(canvas, { fps = 30 } = {}) {
  const mimeType = pickSupportedMimeType();
  const stream = canvas.captureStream(fps);
  const chunks = [];
  const recorder = new MediaRecorder(
    stream,
    mimeType ? { mimeType } : undefined
  );

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  function start() {
    chunks.length = 0;
    recorder.start(1000);
  }

  function stop() {
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || "video/webm" });
        resolve({
          blob,
          extension: extensionForMimeType(mimeType || "video/webm"),
        });
      };
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    });
  }

  return { start, stop };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { createCanvasRecorder, downloadBlob, pickSupportedMimeType };
