import { useEffect,useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {useFetch} from '../../sharedLib/Server/useFetch'

export function SavedAnimationLoader(props) {
  
  
  const port =  props.port;
  const username =  props.username;
  const addAnimation =  props.addAnimation;
  const { getAccessTokenSilently } = useAuth0();

  const [filenames,setFilenames] = useState([]);
  const { data, error, loading } = useFetch(port+`/animationsList/${username}`)

  useEffect(()=>{
    if(data!==null){
      setFilenames(data["names"])
    }

  },[data])

  function name2Id(name){

    console.log(data["names"])
    let index = data["names"].indexOf(name)

    console.log(data["ids"][index])

    
    return data["ids"][index]
  }


  async function onSelectAnimation(filename){
    let animationId = name2Id(filename)
    console.log(animationId)

    const token = await getAccessTokenSilently();
    let  a = await fetch(port + `/loadAnimation/${animationId}`, {method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } ).then(res => res.json())
    // console.log(a["data"])
    addAnimation(a)
  }


  const onChangeScheme = props.onChangeScheme


  return (
    <div className="select_bar">
    <form action="/action_page.php">
          <select className="schemes" id="scheme" onChange={e=>{onSelectAnimation(e.target.value)}}>
            {filenames.map((x)=>
               <option value={x}><p>{x}</p></option>
            )}
          </select>
    </form>
  </div>
  )
}