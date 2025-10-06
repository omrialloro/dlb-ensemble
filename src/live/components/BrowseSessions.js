import styled from "styled-components";
import { useAnimations } from "../../creator/components/animationData/AnimationContext";

const Container = styled.div`
  width: 180px;
  height: 500px;
  top: 30px;
  background-color: rgb(200, 200, 200);
  background-color: rgb(140, 140, 140);
  border-radius: 6px;
  /* background-color: rgb(200, 200, 200); */

  position: relative;
  align-items: center; /* center vertically */
  font-family: sans-serif;
`;

const SessionContainer = styled.div`
  width: 100%;
  height: 88%;
  margin-top: 10px;
  background-color: rgb(200, 200, 200);

  position: relative;
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  /* center horizontally */
  /* justify-content: center;  center vertically */
`;

const Session = styled.div`
  width: 170px;
  height: 40px;
  margin: 5px;
  background-color: rgb(200, 200, 200);
  /* border: 1px solid rgb(50, 40, 60); */
  position: relative;
  display: flex;
  border-radius: 3px;
  justify-content: center; /* center horizontally */
  align-items: center; /* center vertically */
  font-family: sans-serif;
`;

const CloseContainer = styled.div`
  /* position: relative; */
  position: absolute;
  top: 5px;
  right: 8px; /* stick it to the right */
  font-size: 20px;
  font-weight: 500;
  border-radius: 30%;
  width: 20px;
  height: 20px;
  text-align: center;
  justify-content: center;

  background-color: rgb(80, 120, 200);
  cursor: pointer;
`;

const Close = styled.div`
  position: absolute;
  top: 9px;
  height: 23px;
  width: 23px;
  left: 4px;
  border-radius: 10%;
  background-color: rgba(70, 100, 200, 0.3);
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(
      70,
      100,
      200,
      0.6
    ); /* change this to the hover color you want */
    color: white; /* optional: also change text color */
  }
`;

const NameContainer = styled.div`
  display: flex;
  height: 75%;
  width: 70%;
  color: rgb(20, 40, 90);
  border-radius: 6px;
  margin-left: 30px;
  background-color: rgba(220, 120, 120, 0.4);
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(
      240,
      120,
      120,
      0.6
    ); /* change this to the hover color you want */
    color: white; /* optional: also change text color */
  }
  cursor: pointer;
  &:active {
    background-color: rgba(250, 80, 80, 0.8); /* pressed color */
    color: white;
  }

  /* cursor: pointer; */
`;
const Space = styled.div`
  display: flex;
  height: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
  font-size: 14px;
`;

export default function BrowseSessions(props) {
  const { onCloseClick, setSessionName } = props;
  const { removeSessionLive, sessionsLive, LoadSessionLive } = useAnimations();

  return (
    <Container>
      <CloseContainer onClick={onCloseClick}>X</CloseContainer>
      <Space />
      <SessionContainer>
        {sessionsLive.map((session, index) => (
          <Session>
            <Close onClick={() => removeSessionLive(session.sessionName)}>
              X
            </Close>
            <NameContainer
              onClick={() => {
                setSessionName(session.sessionName);
                LoadSessionLive(session.sessionName);
                onCloseClick();
              }}
            >
              <Name> {session.sessionName}</Name>
            </NameContainer>
          </Session>
        ))}
      </SessionContainer>
    </Container>
  );
}
