import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'

const ToggleDiv = styled.div`
  background-image: ${({ theme }) => ( theme.bgComponentGradient )};
`

const TWToggle = tw(ToggleDiv)`
  relative w-20 h-8 mt-3
  flex items-center 
  rounded-full p-1 duration-300 cursor-pointer
`

const ToggleMode = styled.p<{ isActive?: boolean }>`
  position: absolute;
  top: 50%;
  ${({ isActive }) => ( isActive ? 'left: 0.75rem' : 'right: 0.75rem' )};
  font-weight: 200;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transform: translate(0, -50%);
  color: rgba(156, 163, 175, 1);
`

const ToggleDot = styled.div<{ isActive?: boolean }>`
  background-color: ${({ isActive }) => (isActive ? 'rgba(24, 213, 187, 1)' : 'rgba(249, 250, 251, 1)' )};
  transform: ${({ isActive }) => (isActive ? 'translate(48px, 0px)' : '')};
  i {
    font-size: 1.125rem;
    line-height: 1.75rem;
    color: ${({ isActive }) => (isActive ? 'rgba(55, 65, 81, 1)' : 'rgba(209, 213, 219, 1)')};
  }
`

const TWToggleDot = tw(ToggleDot)`
  flex w-6 h-6 items-center justify-center rounded-full shadow-md duration-300 transition
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProps) {
  return (
    <TWToggle onClick={toggle} aria-checked={isActive}>
      {!isActive && (
        <ToggleMode isActive={isActive}>
          Light
        </ToggleMode>
      )}
      {isActive && (
        <ToggleMode isActive={isActive}>
          Dark
        </ToggleMode>
      )}
      <TWToggleDot isActive={isActive}>
        <i className="las la-sun"></i>
      </TWToggleDot>
    </TWToggle>
  )
}
