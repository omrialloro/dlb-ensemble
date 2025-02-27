import styled from "styled-components";

const Button40 = styled.button`
  --glow-color: rgb(217, 76, 55);
  --glow-spread-color: rgba(191, 123, 155, 0.781);
  --enhanced-glow-color: rgb(231, 106, 55);
  --btn-color: rgb(100, 61, 136);

  border: 0.25em solid var(--glow-color);
  padding: 1em 3em;
  color: var(--glow-color);
  font-size: 20px;
  font-weight: bold;
  height: 50px;
  background-color: var(--btn-color);
  border-radius: 1em;
  outline: none;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 0 1em 0.15em var(--glow-color),
    0 0 4em 1em var(--glow-spread-color),
    inset 0 0 0.75em 0.25em var(--glow-color);
  text-shadow: 0 0 0.5em var(--glow-color);

  &::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(1em);
    opacity: 0.7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
  }
  /* 
  &:hover {
    color: var(--btn-color);
    background-color: var(--glow-color);
    box-shadow: 0 0 1em 0.25em var(--glow-color),
      0 0 4em 2em var(--glow-spread-color),
      inset 0 0 0.75em 0.25em var(--glow-color);
  } */

  &:active {
    background-color: var(--glow-color);

    box-shadow: 0 0 0.1em 0.15em var(--glow-color),
      0 0 2.5em 2em var(--glow-spread-color),
      inset 0 0 0.5em 0.25em var(--glow-color);
  }
`;

const ButtonText = styled.span`
  top: 10px;
  left: 20px;
  position: absolute;
  color: rgb(150, 150, 90);
  background: transparent;
  /* Any specific styles for the text can go here */
`;

const MyButton = (props) => (
  <Button40 onClick={props.onClick} role="button">
    <ButtonText>browse </ButtonText>
  </Button40>
);

export default MyButton;
