

let color_scheme1  = [
  '#171616',
  '#B51F1F',
  '#cb4406',
  '#F3F1E0',
  '#cb9d06',
  '#065684'
]

let color_scheme2  = [
  '#ff0000',//'red',
  '#0000ff',//'blue',
  '#FFFFFF',//'white',
  '#000000',//'black',
  '#FFFF00',//'Yellow',
  '#FF00FF'//'magenta'
]


let color_scheme3  = [
  '#28b7ce',
  '#21c17c',
  '#e27940',
  '#1f286d',
  '#dd6cb8',
  '#f2e672',
]

let color_scheme4  = [
  '#4ba8e2',
  '#0b22b6',
  '#919191',
  '#2d2d2d',
  '#ffffff',
  '#f21449'
]

let schemes = {
  "omri":color_scheme1,
  "caribean":color_scheme2,
  "bauhouse":color_scheme3,
  "fururistic":color_scheme4
}


function getSchemes(){return schemes}


function Scheme(props) {

  const onChangeScheme = props.onChangeScheme


  return (
    <div className="select_bar">
    <form action="/action_page.php">
          <select className="schemes" id="scheme" onChange={e=>{onChangeScheme(e.target.value)}}>
            {Object.keys(schemes).map((x)=>
               <option value={x}><p>{x}</p></option>
            )}
          </select>
    </form>
  </div>
  )
}


export {getSchemes, Scheme}
