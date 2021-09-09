import styled from 'styled-components'
import tw from 'tailwind-styled-components'

const custom = styled.div`
  background-color: ${({ theme }) => theme.advancedBG};
`

const TWoSwapPanel = tw(custom)`
  relative
  flex flex-col
  w-full h-full px-3 py-5
  justify-start
  rounded-3xl
`

export default TWoSwapPanel