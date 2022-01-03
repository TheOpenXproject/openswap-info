import React, { useEffect } from 'react'

import TopTokenList from '../components/TokenList'
import TWoSwapPanel from '../components/oSwapPanel'
import { useAllTokenData } from '../contexts/TokenData'
import { TWPageWrapper, TWContentWrapper } from '../components'
import Search from '../components/Search'
import { useMedia } from 'react-use'

import styled from 'styled-components'
import tw from 'tailwind-styled-components'

const IconTextTitle = styled.div`
  color: ${({ theme }) => theme.oSText1};

  i {
    color: ${({ theme }) => theme.oSIcon2}
  }
`

const TWIconTextTitle = tw(IconTextTitle)`
  flex items-center space-x-3
`

function AllTokensPage() {
  const allTokens = useAllTokenData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  return (
    <TWPageWrapper>
      <TWContentWrapper>
        <div className="flex w-full items-center justify-between mb-6">
          <TWIconTextTitle>
            <i class="las la-medal text-3xl"></i>
            <p class="text-3xl">Top Tokens</p>
          </TWIconTextTitle>
          {!below800 && <Search small={true} />}
        </div>
        <TWoSwapPanel>
          <TopTokenList tokens={allTokens} itemMax={50} />
        </TWoSwapPanel>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default AllTokensPage
