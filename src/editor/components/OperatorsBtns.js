import { useState } from "react";

function Rotate(props) {
  const rotate = props.rotate;
  const index = props.index;

  return (
    <div className="container_btn reflect" onClick={rotate}>
      <div className="btn" style={{ transform: `rotate(${90 * index}deg) ` }}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13" cy="13" r="12.5" fill="#ffcccc" stroke="#cc9900" />
          <path
            d="M16.5 12.75L23.5 12.75C23.6381 12.75 23.75 12.6381 23.75 12.5C23.75 12.3619 23.6381 12.25 23.5 12.25L16.5 12.25C16.3619 12.25 16.25 12.3619 16.25 12.5C16.25 12.6381 16.3619 12.75 16.5 12.75Z"
            fill="#606060"
            stroke="#606060"
            stroke-width="1.5"
          />
        </svg>
      </div>
      {/* <p>{"reflect" + operatorsState["reflect"]}</p> */}
    </div>
  );
}
function Reflect(props) {
  const isOn = props.isOn;
  const clickReflect = props.clickReflect;
  // const [isOn, setIsOn] = useState(0);
  // function clickReflect() {
  //   setIsOn(!isOn);
  // }

  return (
    <div className="container_btn reflect">
      <div
        className="btn"
        onClick={clickReflect}
        style={isOn ? { transform: "none" } : { transform: "scaleX(-1)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="13"
            cy="13"
            r="12.5"
            // fill="#FEE7E7"
            fill="#ffcccc"
            stroke="#cc9900
"
          />
          <path
            d="M16.1111 15.8971V10.1029L19.1156 13L16.1111 15.8971ZM14.7778 19L21 13L14.7778 7L14.7778 19ZM11.2222 19L11.2222 7L5 13L11.2222 19Z"
            fill="#606060"
          />
        </svg>
        {/* <p className="hover_text">Reflection</p> */}
      </div>
    </div>
  );
}
function Reverse(props) {
  const isOn = props.isOn;
  const clickReverse = props.clickReverse;

  return (
    <div className="container_btn color_scheme">
      <div
        className="btn"
        onClick={clickReverse}
        style={{ transform: "rotate(180deg)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 26 26"
        >
          <circle
            cx="13"
            cy="13"
            r="12.5"
            stroke="#cc9900"
            fill={isOn ? "red" : "#ffcccc"}
          />

          <polygon points="10,7 16,13 10,19" fill="#000" />
        </svg>
      </div>
      <p className="hover_text">Reverse</p>

      {/* <p>{"scheme" + operatorsState["scheme"]}</p> */}
    </div>
  );
}

export { Rotate, Reflect, Reverse };
