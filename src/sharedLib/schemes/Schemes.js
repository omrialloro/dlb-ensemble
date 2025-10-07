let color_scheme1 = [
  "#171616",
  "#B51F1F",
  "#cb4406",
  "#F3F1E0",
  "#cb9d06",
  "#065684",
];

let color_scheme2 = [
  "#ff0000", //'red',
  "#0000ff", //'blue',
  "#FFFFFF", //'white',
  "#000000", //'black',
  "#FFFF00", //'Yellow',
  "#FF00FF", //'magenta'
];

let color_scheme3 = [
  "#28b7ce",
  "#21c17c",
  "#e27940",
  "#1f286d",
  "#dd6cb8",
  "#f2e672",
];

let color_scheme4 = [
  "#4ba8e2",
  "#0b22b6",
  "#919191",
  "#2d2d2d",
  "#ffffff",
  "#f21449",
];

let color_scheme5 = [
  "#FF6962",
  "#6FE0BF",
  "#FF5600",
  "#ffff00",
  "#ff3399",
  "#0099cc",
];

let color_scheme6 = [
  "#f34000",
  "#0e7643",
  "#f3d9b1",
  "#7ab7b3",
  "#093b60",
  "#ada02f",
];

let color_scheme7 = [
  "#ecce5d",
  "#f4682f",
  "#657895",
  "#332a26",
  "#e8dbd3",
  "#977156",
];

let color_scheme8 = [
  "#e3e3d8",
  "#c4c4bb",
  "#9e9e96",
  "#424240",
  "#292928",
  "#0a0a0a",
];
let color_scheme9 = [
  "#142d00",
  "#07ff00",
  "#c1ff00",
  "#e9ffe9",
  "#ff3c00",
  "#828783",
];

let color_scheme10 = [
  "#003dff",
  "#ef6843",
  "#ffd9ff",
  "#dddddd",
  "#ffef2e",
  "#00fff2",
];
let color_scheme11 = [
  "#37008e",
  "#07ff00",
  "#bc5ebf",
  "#5fffef",
  "#ffd400",
  "#ff22cb",
];

let color_scheme12 = [
  "#0217aa",
  "#07ff00",
  "#5700aa",
  "#ff8b00",
  "#ef0000",
  "#fff200",
];

let schemes = {
  omri: color_scheme1,
  caribean: color_scheme2,
  bauhouse: color_scheme3,
  fururistic: color_scheme4,
  hypnotic: color_scheme5,
  booboo: color_scheme6,
  looloo: color_scheme7,
  blackandwhite: color_scheme8,
  Retrodioactive: color_scheme9,
  softprime: color_scheme10,
  infectedeggplant: color_scheme11,
  ColorClash: color_scheme12,
};

function getSchemes() {
  return schemes;
}

function Scheme(props) {
  const onChangeScheme = props.onChangeScheme;

  return (
    <div className="select_bar">
      <form action="/action_page.php">
        <select
          className="schemes"
          id="scheme"
          onChange={(e) => {
            onChangeScheme(e.target.value);
          }}
        >
          {Object.keys(schemes).map((x) => (
            <option value={x} key={x + "scheme"}>
              {x}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

export { getSchemes, Scheme };
