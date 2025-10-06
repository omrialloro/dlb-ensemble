import styled from "styled-components";

const LowerBarContainer = styled.div`
  display: flex;
  height: 48px;
  width: 230px;
  justify-content: space-between;
  align-items: center;
  padding: 1px 1px;
  border-radius: 0 6px 6px 0;
  background-color: rgba(30, 100, 130, 0.5);
`;
const Icon = styled.div`
  /* width: 24px;
  height: 24px; */
  margin: 10px;
  cursor: pointer;
  flex: 0 0 auto;
`;

export default function LowerBar(props) {
  const {
    onFullScreenClick,
    onSaveSessionClick,
    onLoadSessionClick,
    onClearSessionClick,
  } = props;

  return (
    <LowerBarContainer>
      <Icon onClick={onLoadSessionClick}>
        <img
          style={{
            width: 25,
            height: 25,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="list-icon.svg"
          alt="delete"
        />
      </Icon>

      <Icon onClick={onClearSessionClick} style={{ cursor: "pointer" }}>
        <img
          style={{
            width: 36,
            height: 36,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="clear-icon.svg"
          alt="delete"
        />
      </Icon>

      <Icon
        onClick={() => {
          console.log("Fdf");
          onSaveSessionClick();
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          style={{
            width: 22,
            height: 22,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="local-save-icon.svg"
          alt="delete"
        />
      </Icon>
      <Icon onClick={onFullScreenClick} style={{ cursor: "pointer" }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 7V2H7"
            stroke="black"
            stroke-width="3"
            // stroke-linecap="round"
            // stroke-linejoin="round"
          />
          <path
            d="M22 7V2H17"
            stroke="black"
            stroke-width="3"
            // stroke-linecap="round"
            // stroke-linejoin="round"
          />
          <path
            d="M7 22L2 22L2 17"
            stroke="black"
            stroke-width="3"
            // stroke-linecap="round"
            // stroke-linejoin="round"
          />
          <path
            d="M17 22L22 22L22 17"
            stroke="black"
            stroke-width="3"
            // stroke-linecap="round"
            // stroke-linejoin="round"
          />
        </svg>
      </Icon>
      {/* <Btn onClick={onFullScreenClick}>Full Screen</Btn>
      <Btn onClick={onLoadSessionClick}>Browse Sessions</Btn>

      <Btn onClick={onSaveSessionClick}>Save Session</Btn>
      <Btn onClick={onClearSessionClick}>Clear Session</Btn> */}
    </LowerBarContainer>
  );
}
