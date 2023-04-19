function extractToGif(port, frames, time_ms) {
  const prefix = window.prompt("enter gif name");
  let name = prefix + String(Date.now());
  let data = {
    name: name,
    speed: Math.round(time_ms),
    data: frames,
    save_animation: true,
  };
  console.log(frames);
  fetch(port + "/gif", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let aaa = document.createElement(`a`);
  aaa.href = port + `/download/${name}`;
  aaa.click();
}

function saveAnimation(port, username, name, frames) {
  // const prefix = window.prompt("enter gif name")
  // let name = prefix+String(Date.now())
  let data = {
    username: username,
    name: name,
    data: frames,
    save_animation: true,
  };
  console.log(frames);
  fetch(port + "/saveAnimation", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // let aaa =  document.createElement(`a`);
  // aaa.href = port+`/download/${name}`
  // aaa.click()
}

export { extractToGif, saveAnimation };
