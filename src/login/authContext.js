import { createContext, useEffect, useState } from "react";
import { serverUrl } from "../settings";

export const AuthContext = createContext({
  isAuthenticated: false,
  token: undefined,
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(sessionStorage.getItem("auth"));
  async function registerOrLogin(credentials) {
    const response = await fetch(`${serverUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      setAuth();
    }
    setAuth(await response.json());
  }

  useEffect(() => {
    sessionStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  async function logout() {
    setAuth();
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!auth, auth, registerOrLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
