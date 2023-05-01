import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./login/authContext";
export const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  return (
    <div className="header">
      <ul>
        {isAuthenticated ? (
          <li onClick={() => logout({ returnTo: window.location.origin })}>
            logout
          </li>
        ) : (
          <li>
            <Link to="/login">login</Link>
          </li>
        )}
        <li>
          <Link to="/editor">editor</Link>
        </li>
        <li>
          <Link to="/creator">creator</Link>
        </li>
      </ul>
    </div>
  );
};
