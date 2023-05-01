import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../login/authContext";
import { serverUrl } from "../../settings";

export function useFetch(url, refresh) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    auth: { token },
  } = useContext(AuthContext);
  console.log("refresh", refresh);
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const res = await fetch(serverUrl + url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setError(await res.json());
        } else {
          setData(await res.json());
        } 
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [url, refresh, token]);

  return { data, error, loading };
}

// export function usePost(url, data) {
//   // const [data,setData] = useState(null)
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     (async function () {
//       try {
//         setLoading(true);
//         const token = await getAccessTokenSilently();
//         await fetch(url, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [url]);

//   return { data, error, loading };
// }
