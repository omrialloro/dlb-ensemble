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
    // setFilenames(data)
    console.log(data)
    if(data!==null){
      setFilenames(data)
    }

  },[data])


  async function onSelectAnimation(filename){
    
    const token = await getAccessTokenSilently();
    let  a = await fetch(port + `/loadAnimation/${username}/${filename}`, {method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } ).then(res => res.json())
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