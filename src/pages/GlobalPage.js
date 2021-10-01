import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

import { useGlobalData, useGlobalTransactions } from '../contexts/GlobalData'
import { useAllPairData } from '../contexts/PairData'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import TWoSwapPanel from '../components/oSwapPanel'
import { useAllTokenData } from '../contexts/TokenData'
import { formattedNum, formattedPercent } from '../utils'
import { TYPE } from '../Theme'
import { CustomLink } from '../components/Link'

import { TWPageWrapper, TWContentWrapper } from '../components'
import TWCheckbox from '../components/TWCheckbox'
import QuestionHelper from '../components/QuestionHelper'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
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

function GlobalPage() {
  // get data for lists and totals
  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const transactions = useGlobalTransactions()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  // scrolling refs
  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  // for tracked data on pairs
  const [useTracked, setUseTracked] = useState(true)

  return (
    <TWPageWrapper>
      <TWContentWrapper>
        <div>
          <AutoColumn gap="24px" style={{ paddingBottom: below800 ? '0' : '24px' }}>
            <TWIconTextTitle>
              <i class="las la-chart-line text-3xl"></i>
              <p class="text-3xl">OpenSwap Analytics</p>
            </TWIconTextTitle>
            <Search />
            <GlobalStats />
          </AutoColumn>
          {below800 && ( // mobile card
            <Box mb={20}>
              <TWoSwapPanel className="px-6">
                <Box>
                  <AutoColumn gap="36px">
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Volume (24hrs)</TYPE.main>
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : '-'}
                        </TYPE.main>
                        <TYPE.main fontSize={12}>{volumeChangeUSD ? formattedPercent(volumeChangeUSD) : '-'}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Total Liquidity</TYPE.main>
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : '-'}
                        </TYPE.main>
                        <TYPE.main fontSize={12}>
                          {liquidityChangeUSD ? formattedPercent(liquidityChangeUSD) : '-'}
                        </TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </AutoColumn>
                </Box>
              </TWoSwapPanel>
            </Box>
          )}
          {!below800 && (
            <GridRow>
              <TWoSwapPanel style={{ minHeight: '300px' }}>
                <GlobalChart display="liquidity" />
              </TWoSwapPanel>
              <TWoSwapPanel>
                <GlobalChart display="volume" />
              </TWoSwapPanel>
            </GridRow>
          )}
          {below800 && (
            <AutoColumn style={{ marginTop: '6px' }} gap="24px">
              <TWoSwapPanel>
                <GlobalChart display="liquidity" />
              </TWoSwapPanel>
            </AutoColumn>
          )}
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TWIconTextTitle>
                <i class="las la-medal text-2xl pl-2"></i>
                <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                  Top Tokens
                </TYPE.main>
              </TWIconTextTitle>
              <CustomLink to={'/tokens'}>See All</CustomLink>
            </RowBetween>
          </ListOptions>
          <TWoSwapPanel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <TopTokenList tokens={allTokens} />
          </TWoSwapPanel>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TWIconTextTitle>
                <i class="las la-trophy text-2xl pl-2"></i>
                <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                  Top Pairs
                </TYPE.main>
              </TWIconTextTitle>
              <AutoRow gap="4px" width="100%" justifyContent="flex-end">
                <TWCheckbox 
                  label="Hide untracked pairs"
                  value="value"
                  checked={useTracked}
                  setChecked={() => setUseTracked(!useTracked)}
                />
                <QuestionHelper size="text-2xl" text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ONE or stablecoins." />
                <CustomLink to={'/pairs'}>See All</CustomLink>
              </AutoRow>
            </RowBetween>
          </ListOptions>
          <TWoSwapPanel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <PairList pairs={allPairs} useTracked={useTracked} />
          </TWoSwapPanel>
          <span>
            <TWIconTextTitle style={{ marginTop: '2rem' }}>
              <i class="las la-file-invoice-dollar text-2xl pl-2"></i>
              <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                Transactions
              </TYPE.main>
            </TWIconTextTitle>
          </span>
          <TWoSwapPanel style={{ marginTop: '16px', padding: '20px' }}>
            <TxnList transactions={transactions} />
          </TWoSwapPanel>
        </div>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default withRouter(GlobalPage)
