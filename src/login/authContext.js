import { createContext, useContext, useEffect, useState } from "react";
import { serverUrl } from "../settings";

export const AuthContext = createContext({
  isAuthenticated: false,
  token: undefined,
});

export function useLoginOrRegister() {
  const { loginOrRegister } = useContext(AuthContext);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const loginOrRegisterCallback = async (credentials) => {
    setLoading(true);
    try {
      await loginOrRegister(credentials);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    setError();
    setLoading(false);
  };
  return { loginOrRegister: loginOrRegisterCallback };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});

  async function loginOrRegister(credentials) {
    const response = await fetch(`${serverUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      setAuth();
      const { message } = await response.json();
      throw new Error(message);
    }
    setAuth(await response.json());
    return true;
  }

  useEffect(() => {
    // check localStorage

    const check = async (auth) => {
      const res = await fetch(serverUrl + `/check`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (res.ok) setAuth(auth);
    };

    try {
      console.log("loading auth from storage", localStorage.getItem("auth"));
      const auth = JSON.parse(localStorage.getItem("auth"));
      check(auth);
    } catch {
      console.error("could not read auth from storage");
    }
  }, []);

  useEffect(() => {
    console.log("storing auth", auth);
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  async function logout() {
    setAuth();
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!auth?.token,
        auth,
        loginOrRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
