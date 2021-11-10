import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import Link from '../components/Link'
import TokenLogo from '../components/TokenLogo'
import PairList from '../components/PairList'
import DataLoader from '../components/DataLoader'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { TWButtonLight } from '../components/ButtonStyled'
import TxnList from '../components/TxnList'
import TokenChart from '../components/TokenChart'
import { BasicLink } from '../components/Link'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, localNumber } from '../utils'
import { useTokenData, useTokenTransactions, useTokenPairs } from '../contexts/TokenData'
import { TYPE } from '../Theme'
import { useColor } from '../hooks'
import CopyHelper from '../components/Copy'
import { useMedia } from 'react-use'
import { useDataForList } from '../contexts/PairData'
import { useEffect } from 'react'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedTokens } from '../contexts/LocalStorage'
import { BlockedWrapper, BlockedMessageWrapper } from '../components'
import { AlertCircle } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'
import HoverText from '../components/HoverText'
import { UNTRACKED_COPY, TOKEN_BLACKLIST, BLOCKED_WARNINGS } from '../constants'
import QuestionHelper from '../components/QuestionHelper'
import { shortenAddress } from '../utils'
import { TWPageWrapper, TWContentWrapper } from '../components'
import TWoSwapPanel from '../components/oSwapPanel'
import TWCheckbox from '../components/TWCheckbox'

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

const WarningIcon = styled(AlertCircle)`
  stroke: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  opacity: 0.6;
`

const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

const IconTextTitle = styled.div`
  color: ${({ theme }) => theme.oSText1};

  i {
    color: ${({ theme }) => theme.oSIcon2};
  }
`

const TWIconTextTitle = tw(IconTextTitle)`
  flex items-center space-x-3
`

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

function TokenPage({ address, history }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const allPairs = useTokenPairs(address)

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs)

  // all transactions with this token
  const transactions = useTokenTransactions(address)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  // volume
  const volume = formattedNum(!!oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT, true)

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT
  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT)

  // liquidity
  const liquidity = formattedNum(totalLiquidityUSD, true)
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  const below1080 = useMedia('(max-width: 1080px)')
  const below800 = useMedia('(max-width: 800px)')
  const below600 = useMedia('(max-width: 600px)')
  const below500 = useMedia('(max-width: 500px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)
  const listedTokens = useListedTokens()

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const [useTracked, setUseTracked] = useState(true)

  if (TOKEN_BLACKLIST.includes(address)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: 'center' }}>
              {BLOCKED_WARNINGS[address] ?? `This token is not supported.`}
            </TYPE.light>
            <Link
              external={true}
              href={'https://explorer.harmony.one/address/' + address}
            >{`More about ${shortenAddress(address)}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    )
  }

  return (
    <TWPageWrapper>
      <Warning
        type={'token'}
        show={!dismissed && listedTokens && !listedTokens.includes(address)}
        setShow={markAsDismissed}
        address={address}
      />
      <TWContentWrapper>
        <div className="flex justify-between w-full">
          <AutoRow align="flex-end" className="space-x-3 items-center" style={{ width: 'fit-content' }}>
            <BasicLink to="/tokens">
              <TWIconTextTitle>
                <TokenLogo address={address} size="32px" />
                <p>{symbol}</p>
              </TWIconTextTitle>
            </BasicLink>
            <Link style={{ width: 'fit-content' }} external href={'https://explorer.harmony.one/address/' + address}>
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                {address.slice(0, 8) + '...' + address.slice(36, 42)}
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </div>
        <DashboardWrapper style={{ marginTop: '1rem' }}>
          <>
            {!below1080 && (
              <RowFixed>
                <TWIconTextTitle>
                  <i class="las la-chart-area text-2xl pl-2"></i>
                  <p class="text-base">Token Stats</p>
                </TWIconTextTitle>
                {usingUtVolume && (
                  <HoverText text={UNTRACKED_COPY}>
                    <WarningIcon />
                  </HoverText>
                )}
              </RowFixed>
            )}
            <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
              {below1080 && price && (
                <TWoSwapPanel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Price</TYPE.main>
                    </RowBetween>
                    <RowBetween align="flex-end">
                      {' '}
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {price}
                      </TYPE.main>
                      <TYPE.main>{priceChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </TWoSwapPanel>
              )}
              <TWoSwapPanel className="h-1/3 px-6">
                <div className="flex flex-col justify-between h-full">
                  <RowBetween>
                    <TYPE.main>Total Liquidity</TYPE.main>
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {liquidity}
                    </TYPE.main>
                    <TYPE.main>{liquidityChange}</TYPE.main>
                  </RowBetween>
                </div>
              </TWoSwapPanel>

              <TWoSwapPanel className="h-1/3 px-6">
                <div className="flex flex-col justify-between h-full">
                  <RowBetween>
                    <TYPE.main>Volume (24hrs)</TYPE.main>
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </TYPE.main>
                    <TYPE.main>{volumeChange}</TYPE.main>
                  </RowBetween>
                </div>
              </TWoSwapPanel>

              <TWoSwapPanel className="h-1/3 px-6">
                <div className="flex flex-col justify-between h-full">
                  <RowBetween>
                    <TYPE.main>Transactions (24hrs)</TYPE.main>
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? localNumber(oneDayTxns) : 0}
                    </TYPE.main>
                    <TYPE.main>{txnChangeFormatted}</TYPE.main>
                  </RowBetween>
                </div>
              </TWoSwapPanel>

              <TWoSwapPanel
                style={{
                  gridColumn: below1080 ? '1' : '2/4',
                  gridRow: below1080 ? '' : '1/4',
                }}
              >
                <TokenChart address={address} base={priceUSD} color={'#1bf2ba'} />
              </TWoSwapPanel>
            </PanelWrapper>
          </>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TWIconTextTitle>
                <i class="las la-medal text-2xl pl-2"></i>
                <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                  Top Pairs
                </TYPE.main>
              </TWIconTextTitle>
              <AutoRow gap="4px" style={{ width: 'fit-content' }}>
                <TWCheckbox
                  label="Hide untracked pairs"
                  value="value"
                  checked={useTracked}
                  setChecked={() => setUseTracked(!useTracked)}
                />
                <QuestionHelper
                  size="text-2xl"
                  text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ONE or stablecoins."
                />
              </AutoRow>
            </RowBetween>
          </ListOptions>
          <TWoSwapPanel className="px-6">
            {address && fetchedPairsList ? (
              <PairList address={address} pairs={fetchedPairsList} useTracked={useTracked} />
            ) : (
              <DataLoader />
            )}
          </TWoSwapPanel>

          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <TWIconTextTitle>
              <i class="las la-file-invoice-dollar text-2xl pl-2"></i>
              <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                Transactions
              </TYPE.main>
            </TWIconTextTitle>
          </ListOptions>
          <TWoSwapPanel className="px-6">
            {transactions ? <TxnList transactions={transactions} /> : <DataLoader />}
          </TWoSwapPanel>

          <>
            <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
              <TWIconTextTitle>
                <i class="las la-question-circle text-3xl pl-2"></i>
                <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                  Token Information
                </TYPE.main>
              </TWIconTextTitle>
            </ListOptions>
            <TWoSwapPanel className="px-6">
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Symbol</TYPE.main>
                  <Text style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                    <FormattedName text={symbol} maxCharacters={12} />
                  </Text>
                </Column>
                <Column>
                  <TYPE.main>Name</TYPE.main>
                  <TYPE.main style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                    <FormattedName text={name} maxCharacters={16} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                      {address.slice(0, 8) + '...' + address.slice(36, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={address} />
                  </AutoRow>
                </Column>
                <Link external href={'https://explorer.harmony.one/address/' + address}>
                  <TWButtonLight className="h-12">View on Explorer</TWButtonLight>
                </Link>
              </TokenDetailsLayout>
            </TWoSwapPanel>
          </>
        </DashboardWrapper>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default withRouter(TokenPage)

{
  /* <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(address)}> */
}
