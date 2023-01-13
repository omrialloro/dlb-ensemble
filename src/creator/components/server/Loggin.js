import { useState } from "react";

export function Loggin(props){

  const setUsername = props.setUsername
  const [name,setName] = useState('')
  
  return(

    <form >
                <label>
                  <input style={{width:'20%'}} type="text"
                   value={name}
                   onChange={(e) => {console.log(e.target.value);setName(e.target.value)}}
                  />
                </label>
                <div onClick={()=>{console.log("DFDFF");setUsername(name)}}>SUBMIT</div>
    </form>
  )
}