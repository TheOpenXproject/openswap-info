import React from 'react'
import { Button as RebassButton } from 'rebass/styled-components'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { Plus, ChevronDown, ChevronUp } from 'react-feather'
import { darken, transparentize } from 'polished'
import { RowBetween } from '../Row'
import { StyledIcon } from '..'

const Base = styled(RebassButton)`
  padding: 8px 12px;
`

const TWBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 9999px;
  min-width: fit-content;
  white-space: nowrap;
  background-color: ${({ active, theme }) => ( active ? 'rgba(24, 213, 187, 1)' : theme.bgOSwap1)};
  color: ${({ active, theme }) => ( active ? theme.btnOSwap1 : 'rgba(24, 213, 187, 1)')};

  :hover {
    color: ${({ theme }) => theme.btnOSwap1 };
  }
`

export const TWButtonLight = tw(TWBase)`
  px-4 border border-oswapGreen
  hover:bg-oswapGreen
  transition duration-500
`

const BaseCustom = styled(RebassButton)`
  padding: 16px 12px;
  font-size: 0.825rem;
  font-weight: 400;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
`

const Dull = styled(Base)`
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: black;
  height: 100%;
  font-weight: 400;
  &:hover,
  :focus {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.25);
  }
  &:focus {
    box-shadow: 0 0 0 1pt rgba(255, 255, 255, 0.25);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.25);
  }
`

export default function ButtonStyled({ children, ...rest }) {
  return <Base {...rest}>{children}</Base>
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ButtonLight = styled(Base)`
  background-color: ${({ color, theme }) => (color ? transparentize(0.9, color) : transparentize(0.9, theme.primary1))};
  color: ${({ color, theme }) => (color ? darken(0.1, color) : theme.primary1)};

  min-width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  a {
    color: ${({ color, theme }) => (color ? darken(0.1, color) : theme.primary1)};
  }

  :hover {
    background-color: ${({ color, theme }) =>
      color ? transparentize(0.8, color) : transparentize(0.8, theme.primary1)};
  }
`

export function ButtonDropdown({ disabled = false, children, open, ...rest }) {
  return (
    <TWButtonFaded {...rest} disabled={disabled} open={open}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        {open ? (
          <StyledIcon>
            <i class="las la-chevron-circle-up text-2xl text-oswapGreen"></i>
          </StyledIcon>
        ) : (
          <StyledIcon>
            <i class="las la-chevron-circle-down text-2xl text-oswapGreen"></i>
          </StyledIcon>
        )}
      </RowBetween>
    </TWButtonFaded>
  )
}

export const ButtonDark = styled(Base)`
  background-color: ${({ color, theme }) => (color ? color : theme.primary1)};
  color: white;
  width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  :hover {
    background-color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.primary1))};
  }
`

export const ButtonFaded = styled(Base)`
  background-color: ${({ theme }) => theme.bgOSwap1 };
  color: ${({ theme }) => theme.oSText1 }
  white-space: nowrap;
  z-index: 999;
  
  border-top-right-radius: ${({ open }) => (open ? '24px' : '9999px')};
  border-top-left-radius: ${({ open }) => (open ? '24px' : '9999px')};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '9999px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '9999px')};

  :hover {
    opacity: 0.8;
  }
`

export const TWButtonFaded = tw(ButtonFaded)`
  h-12
`

export function ButtonPlusDull({ disabled, children, ...rest }) {
  return (
    <Dull {...rest}>
      <ContentWrapper>
        <Plus size={16} />
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
      </ContentWrapper>
    </Dull>
  )
}

export function ButtonCustom({ children, bgColor, color, ...rest }) {
  return (
    <BaseCustom bg={bgColor} color={color} {...rest}>
      {children}
    </BaseCustom>
  )
}

export const OptionButton = styled.div`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.bg4};
  background-color: ${({ active, theme }) => active && theme.bg3};
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
`

