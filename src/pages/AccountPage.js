import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { useUserTransactions, useUserPositions, useMiningPositions } from '../contexts/User'
import TxnList from '../components/TxnList'
import { formattedNum } from '../utils'
import Row, { AutoRow, RowFixed, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import UserChart from '../components/UserChart'
import PairReturnsChart from '../components/PairReturnsChart'
import PositionList from '../components/PositionList'
import MiningPositionList from '../components/MiningPositionList'
import { TYPE } from '../Theme'
import { ButtonDropdown, TWButtonLight } from '../components/ButtonStyled'
import { StyledIcon } from '../components'
import DoubleTokenLogo from '../components/DoubleLogo'
import { Activity } from 'react-feather'
import Link from '../components/Link'
import { FEE_WARNING_TOKENS } from '../constants'
import { useMedia } from 'react-use'
import Search from '../components/Search'
import { useSavedAccounts } from '../contexts/LocalStorage'

import { TWPageWrapper, TWContentWrapper } from '../components'
import TWoSwapPanel from '../components/oSwapPanel'

const IconTextTitle = styled.div`
  color: ${({ theme }) => theme.oSText1};

  i {
    color: ${({ theme }) => theme.oSIcon2};
  }
`

const TWIconTextTitle = tw(IconTextTitle)`
  flex items-center space-x-3
`

const DashboardWrapper = styled.div`
  width: 100%;
`

const TWDropdownWrapper = tw.div`
  relative mb-6 h-12
`

const Flyout = styled.div`
  position: fixed;
  top: 48px;
  width: 100%;
  background-color: ${({ theme }) => theme.bgOSwap1};
  z-index: 999;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  padding-top: 4px;
`

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`

function AccountPage({ account }) {
  // get data for this account
  const transactions = useUserTransactions(account)
  const positions = useUserPositions(account)
  const miningPositions = useMiningPositions(account)

  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  let totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
          return total + parseFloat(swap.amountUSD)
        }, 0)
      : 0
  }, [transactions])

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (
          FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) ||
          FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)
        ) {
          setShowWarning(true)
        }
      }
    }
  }, [positions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const aggregateFees = dynamicPositions?.reduce(function (total, position) {
    return total + position.fees.sum
  }, 0)

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
          return (
            total +
            (parseFloat(position?.liquidityTokenBalance) / parseFloat(position?.pair?.totalSupply)) *
              position?.pair?.reserveUSD
          )
        }, 0)
      : null
  }, [dynamicPositions])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const below600 = useMedia('(max-width: 600px)')

  // adding/removing account from saved accounts
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const isBookmarked = savedAccounts.includes(account)
  const handleBookmarkClick = useCallback(() => {
    ;(isBookmarked ? removeAccount : addAccount)(account)
  }, [account, isBookmarked, addAccount, removeAccount])

  return (
    <TWPageWrapper>
      <TWContentWrapper>
        <div className="flex w-full items-center justify-between mb-6">
          <TWIconTextTitle>
            <i class="las la-wallet text-3xl"></i>
            <Link lineHeight={'145.23%'} href={'https://explorer.harmony.one/address/' + account} target="_blank">
              <TYPE.header fontSize={24}>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
            </Link>
          </TWIconTextTitle>
          {!below600 && <Search small={true} />}
        </div>
        <DashboardWrapper>
          {showWarning && <Warning>Fees cannot currently be calculated for pairs that include AMPL.</Warning>}
          {!hideLPContent && (
            <TWDropdownWrapper>
              <ButtonDropdown width="100%" onClick={() => setShowDropdown(!showDropdown)} open={showDropdown}>
                {!activePosition && (
                  <RowFixed>
                    <StyledIcon>
                      <i class="las la-layer-group text-2xl"></i>
                    </StyledIcon>
                    <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                  </RowFixed>
                )}
                {activePosition && (
                  <RowFixed>
                    <DoubleTokenLogo a0={activePosition.pair.token0.id} a1={activePosition.pair.token1.id} size={30} />
                    <TYPE.body ml={'16px'}>
                      {activePosition.pair.token0.symbol}-{activePosition.pair.token1.symbol} Position
                    </TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              {showDropdown && (
                <Flyout>
                  <AutoColumn gap="0px">
                    {positions?.map((p, i) => {
                      if (p.pair.token1.symbol === 'WONE') {
                        p.pair.token1.symbol = 'ONE'
                      }
                      if (p.pair.token0.symbol === 'WONE') {
                        p.pair.token0.symbol = 'ONE'
                      }
                      return (
                        p.pair.id !== activePosition?.pair.id && (
                          <MenuRow
                            onClick={() => {
                              setActivePosition(p)
                              setShowDropdown(false)
                            }}
                            key={i}
                          >
                            <DoubleTokenLogo a0={p.pair.token0.id} a1={p.pair.token1.id} size={16} />
                            <TYPE.body ml={'16px'}>
                              {p.pair.token0.symbol}-{p.pair.token1.symbol} Position
                            </TYPE.body>
                          </MenuRow>
                        )
                      )
                    })}
                    {activePosition && (
                      <MenuRow
                        onClick={() => {
                          setActivePosition()
                          setShowDropdown(false)
                        }}
                      >
                        <RowFixed>
                          <StyledIcon>
                            <Activity size={16} />
                          </StyledIcon>
                          <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                        </RowFixed>
                      </MenuRow>
                    )}
                  </AutoColumn>
                </Flyout>
              )}
            </TWDropdownWrapper>
          )}
          {!hideLPContent && (
            <TWoSwapPanel className="px-6" style={{ height: '100%', marginBottom: '1rem' }}>
              <AutoRow gap="20px">
                <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Liquidity (Including Fees)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header fontSize={'24px'} lineHeight={1}>
                      {positionValue
                        ? formattedNum(positionValue, true)
                        : positionValue === 0
                        ? formattedNum(0, true)
                        : '-'}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Fees Earned (Cumulative)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header fontSize={'24px'} lineHeight={1} color={aggregateFees && 'green'}>
                      {aggregateFees ? formattedNum(aggregateFees, true, true) : '-'}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn>
              </AutoRow>
            </TWoSwapPanel>
          )}
          {!hideLPContent && (
            // <TestChart />
            <PanelWrapper>
              <TWoSwapPanel className="pl-6 pr-4" style={{ gridColumn: '1' }}>
                {activePosition ? (
                  <PairReturnsChart account={account} position={activePosition} />
                ) : (
                  <UserChart account={account} position={activePosition} />
                )}
              </TWoSwapPanel>
            </PanelWrapper>
          )}
          <TWIconTextTitle className="mt-6">
            <i class="las la-list-alt text-2xl"></i>
            <p class="text-base">Positions</p>
          </TWIconTextTitle>
          <TWoSwapPanel className="px-6" style={{ marginTop: '1.5rem' }}>
            <PositionList positions={positions} />
          </TWoSwapPanel>
          <TWIconTextTitle className="mt-6">
            <i class="las la-tint text-2xl"></i>
            <p class="text-base">Liquidity Mining Pools</p>
          </TWIconTextTitle>
          <TWoSwapPanel className="px-6" style={{ marginTop: '1.5rem' }}>
            {miningPositions && <MiningPositionList miningPositions={miningPositions} />}
            {!miningPositions && (
              <AutoColumn gap="8px" justify="flex-start">
                <TYPE.main>No Staked Liquidity.</TYPE.main>
                <AutoRow gap="8px" justify="flex-start">
                  <Link external href="https://docs.openswap.one/guide/liquidity">
                    <TWButtonLight className="h-8">Learn More</TWButtonLight>
                  </Link>
                </AutoRow>{' '}
              </AutoColumn>
            )}
          </TWoSwapPanel>
          <TWIconTextTitle className="mt-6">
            <i class="las la-sync text-2xl"></i>
            <p class="text-base">Transactions</p>
          </TWIconTextTitle>
          <TWoSwapPanel className="px-6" style={{ marginTop: '1.5rem' }}>
            <TxnList transactions={transactions} />
          </TWoSwapPanel>
          <TWIconTextTitle className="mt-6">
            <i class="las la-wallet text-2xl"></i>
            <p class="text-base">Wallet Stats</p>
          </TWIconTextTitle>
          <TWoSwapPanel className="px-6" style={{ marginTop: '1.5rem' }}>
            <AutoRow gap="20px">
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</TYPE.header>
                <TYPE.main>Total Value Swapped</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}
                </TYPE.header>
                <TYPE.main>Total Fees Paid</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{transactionCount ? transactionCount : '-'}</TYPE.header>
                <TYPE.main>Total Transactions</TYPE.main>
              </AutoColumn>
            </AutoRow>
          </TWoSwapPanel>
        </DashboardWrapper>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default AccountPage
