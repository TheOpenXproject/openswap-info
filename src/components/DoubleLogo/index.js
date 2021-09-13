import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import TokenLogo from '../TokenLogo'

export default function DoubleTokenLogo({ a0, a1, size = '' }) {
  const Token1 = styled(TokenLogo)`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  `

  const Token2 = styled(TokenLogo)`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  `
  
  const TWToken1 = tw(Token1)`,
    z-30
  `
  
  const TWToken2 = tw(Token2)`
    z-20
  `
  
  const TWTokenWrapper = tw.div`
    flex flex-row-reverse -space-x-4 space-x-reverse items-center
  `

  return (
    <TWTokenWrapper>
      <TWToken1 address={a0} size={size} />
      <TWToken2 address={a1} size={size} />
    </TWTokenWrapper>
  )
}
