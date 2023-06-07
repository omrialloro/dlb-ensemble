import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./login/authContext";
export const Header = (props) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { browse, save, gif } = props;

  return (
    <header>
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10 10 10 10px",
        }}
      >
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
          <Link to="/editor">Editor</Link>
        </li>
        <li>
          <Link to="/creator">Creator</Link>
        </li>
        <li>
          <div onClick={browse}>Browse</div>
        </li>
        <li>
          <div onClick={save}>Save</div>
        </li>
        <li>
          <div onClick={gif}>Gif</div>
        </li>
      </ul>
    </header>
  );
};
