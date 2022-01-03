import React, { useEffect } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../Theme'
import Panel from '../components/Panel'
import LPList from '../components/LPList'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import AccountSearch from '../components/AccountSearch'
import { useTopLps } from '../contexts/GlobalData'
import DataLoader from '../components/DataLoader'
import { RowBetween } from '../components/Row'
import { useMedia } from 'react-use'
import Search from '../components/Search'
import { TWPageWrapper, TWContentWrapper } from '../components'
import TWoSwapPanel from '../components/oSwapPanel'

const TWAccountWrapper = tw.div`
  flex w-full
`

const IconTextTitle = styled.div`
  color: ${({ theme }) => theme.oSText1};

  i {
    color: ${({ theme }) => theme.oSIcon2}
  }
`

const TWIconTextTitle = tw(IconTextTitle)`
  flex items-center space-x-3
`

function AccountLookup() {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const topLps = useTopLps()

  const below800 = useMedia('(max-width: 600px)')

  return (
    <TWPageWrapper>
      <TWContentWrapper>
        <div className="flex w-full items-center justify-between mb-6">
          <TWIconTextTitle>
            <i class="las la-user text-3xl"></i>
            <p class="text-3xl">Wallet Analytics</p>
          </TWIconTextTitle>
          {!below800 && <Search small={true} />}
        </div>
        <TWAccountWrapper>
          <AccountSearch />
        </TWAccountWrapper>
        <div className="flex w-full items-center justify-between my-6">
          <TWIconTextTitle>
            <i class="las la-trophy text-3xl"></i>
            <p class="text-xl">Top Liquidity Positions</p>
          </TWIconTextTitle>
        </div>
        <TWoSwapPanel>{topLps && topLps.length > 0 ? <LPList lps={topLps} maxItems={200} /> : <DataLoader />}</TWoSwapPanel>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default withRouter(AccountLookup)
