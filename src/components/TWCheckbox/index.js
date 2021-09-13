import React from "react"
import styled, { keyframes } from "styled-components"
import tw from 'tailwind-styled-components'

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`

const Label = styled.label`
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  color: ${({ theme }) => theme.oSText1 }
`

const TWLabel = tw(Label)`
  flex items-center flex-row-reverse
  text-sm font-extralight
`

const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(45deg);
  }
`

const Indicator = styled.div`
  background: ${({ theme }) => theme.advancedBG };

  &::after {
    content: "";
    position: absolute;
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    width: 35%;
    height: 70%;
    bottom: 25%;
    border: solid ${({theme}) => theme.oswapGreen.DEFAULT };
    border-width: 0 0.2em 0.2em 0;
    animation-name: ${rotate};
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }
`
const TWIndicator = tw(Indicator)`
  relative mr-2 flex items-center justify-center
  h-6 w-6 rounded-md border border-black border-opacity-10
`

const TWCheckbox = ({ 
  value,
  checked,
  setChecked ,
  name,
  id,
  label,
  }) => {
  return (
    <TWLabel htmlFor={id}>
      {label}
      <Input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={setChecked}
      />
      <TWIndicator />
    </TWLabel>
  );
}

export default TWCheckbox