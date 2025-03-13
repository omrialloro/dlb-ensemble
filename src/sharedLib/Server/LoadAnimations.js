import { useEffect, useState } from "react";

export function SavedAnimationLoader(props) {
  const port = props.port;
  const username = props.username;
  const addAnimation = props.addAnimation;

  const [filenames, setFilenames] = useState([]);

  useEffect(() => {
    async function getAnimationList() {
      let data = await fetch(port + `/animationsList/${username}`, {
        method: "GET",
      }).then((res) => res.json());
      setFilenames(data);
    }
    getAnimationList();
  }, []);

  useEffect(() => {
    console.log(filenames);
  }, [filenames]);

  async function onSelectAnimation(filename) {
    console.log(filename);
    let a = await fetch(port + `/loadAnimation/${username}/${filename}`, {
      method: "GET",
    }).then((res) => res.json());
    addAnimation(a);
    // console.log(a)
  }

  const onChangeScheme = props.onChangeScheme;

  return (
    <div className="select_bar">
      <form action="/action_page.php">
        <select
          className="schemes"
          id="scheme"
          onChange={(e) => {
            onSelectAnimation(e.target.value);
          }}
        >
          {filenames.map((x) => (
            <option value={x}>
              <p>{x}</p>
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
