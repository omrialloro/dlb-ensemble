import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./login/authContext";
import styled from "styled-components";
import { useState } from "react";

const StyledLi = styled.div`
  font-size: "20px";
  padding-left: "20px";
  padding-right: "20px";
  font-weight: "bold";
  &:hover {
    background-color: #cc5200;
  }
`;

export const Header = (props) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { browse, save, gif, selected } = props;

  return (
    <header>
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10 10 10 10px",
          float: "left",
          paddingLeft: "30px",
          marginLeft: "10px",
          marginRight: "100px",
        }}
      >
        <StyledLi>
          <Link
            style={
              selected == "editor"
                ? {
                    fontSize: "23px",
                    color: "#996600",
                    paddingRight: "20px",
                    paddingLeft: "20px",
                    backgroundColor: "#ff4000",
                    fontWeight: "bold",
                  }
                : {
                    fontSize: "23px",
                    color: "#996600",
                    paddingRight: "20px",
                    paddingLeft: "20px",
                    backgroundColor: null,
                    fontWeight: "bold",
                  }
            }
            to="/editor"
          >
            EDITOR
          </Link>
        </StyledLi>
        <StyledLi>
          <Link
            style={
              selected == "creator"
                ? {
                    fontSize: "23px",
                    color: "#996600",
                    paddingRight: "20px",
                    paddingLeft: "20px",
                    backgroundColor: "#ff4000",
                    fontWeight: "bold",
                  }
                : {
                    fontSize: "23px",
                    color: "#996600",
                    paddingRight: "20px",
                    paddingLeft: "20px",

                    backgroundColor: null,
                    fontWeight: "bold",
                  }
            }
            to="/creator"
          >
            MAKER
          </Link>
        </StyledLi>
        {isAuthenticated ? (
          <StyledLi
            style={{
              fontSize: "23px",
              color: "#996600",
              marginLeft: "0px",
              paddingLeft: "20px",
              paddingRight: "20px",

              fontWeight: "bold",

              // backgroundColor: "red",
            }}
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            LOGOUT
          </StyledLi>
        ) : (
          <li>
            <Link
              style={
                selected == "login"
                  ? {
                      fontSize: "23px",
                      color: "#996600",
                      paddingRight: "20px",
                      paddingLeft: "20px",
                      backgroundColor: "null",
                      fontWeight: "bold",
                    }
                  : {
                      fontSize: "23px",
                      color: "#996600",
                      paddingRight: "20px",
                      paddingLeft: "20px",
                      backgroundColor: "#ff4000",
                      fontWeight: "bold",
                    }
              }
              to="/login"
            >
              LOGIN
            </Link>
          </li>
        )}
      </ul>
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10 10 10 10px",
          float: "left",
          paddingLeft: "30px",
          marginLeft: "100px",
        }}
      >
        {/* <StyledLi
          style={{
            fontSize: "22px",
            color: "#992600",

            paddingRight: "20px",
            paddingLeft: "20px",

            fontWeight: "bold",
          }}
          onClick={browse}
        >
          BROWSE
        </StyledLi> */}
        <StyledLi
          style={{
            fontSize: "22px",
            color: "#992600",

            paddingRight: "20px",
            paddingLeft: "20px",

            fontWeight: "bold",
          }}
        >
          <div onClick={save}>SAVE</div>
        </StyledLi>
        <StyledLi
          style={{
            fontSize: "22px",
            color: "#992600",
            // marginLeft: "30px",
            // backgroundColor: "red",
            paddingLeft: "20px",
            paddingRight: "20px",

            fontWeight: "bold",
          }}
        >
          <div onClick={gif}>GIF</div>
        </StyledLi>
      </ul>
    </header>
  );
};
