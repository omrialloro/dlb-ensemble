import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";

export  function useFetch(url,refresh){

    const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    const token = await getAccessTokenSilently();
                    await fetch(url
                        ,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      ).then(res => res.json()).then((d)=>{setData(d)})
                    console.log(data)
                }catch(err){
                    setError(err)
                }finally{

                    setLoading(false)
                }
            }
        )()
    }, [url,refresh])

    
    

    return { data, error, loading }

}

export  function usePost(url,data){

    // const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    const token = await getAccessTokenSilently();
                    await fetch(url
                        ,
                        {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                    console.log(data)
                }catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [url])

    
    

    return { data, error, loading }

}