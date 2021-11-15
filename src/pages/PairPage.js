import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import 'feather-icons'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import Panel from '../components/Panel'
import {
  PageWrapper,
  ContentWrapperLarge,
  StyledIcon,
  BlockedWrapper,
  BlockedMessageWrapper,
} from '../components/index'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { TWButtonLight } from '../components/ButtonStyled'
import PairChart from '../components/PairChart'
import Link from '../components/Link'
import TxnList from '../components/TxnList'
import DataLoader from '../components/DataLoader'
import { BasicLink } from '../components/Link'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, shortenAddress } from '../utils'
import { useColor } from '../hooks'
import { usePairData, usePairTransactions } from '../contexts/PairData'
import { TYPE } from '../Theme'
import { Text } from 'rebass'
import CopyHelper from '../components/Copy'
import { useMedia } from 'react-use'
import DoubleTokenLogo from '../components/DoubleLogo'
import TokenLogo from '../components/TokenLogo'
import { Hover } from '../components'
import { useEthPrice } from '../contexts/GlobalData'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedPairs } from '../contexts/LocalStorage'

import { Bookmark, PlusCircle, AlertCircle } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'
import HoverText from '../components/HoverText'
import { UNTRACKED_COPY, PAIR_BLACKLIST, BLOCKED_WARNINGS } from '../constants'

import { TWPageWrapper, TWContentWrapper } from '../components'
import TWoSwapPanel from '../components/oSwapPanel'

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
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
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

const FixedPanel = styled(Panel)`
  width: fit-content;
  padding: 8px 12px;
  border-radius: 10px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const HoverSpan = styled.span`
  :hover {
    cursor: pointer;
    opacity: 0.7;
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

function PairPage({ pairAddress, history }) {
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  const transactions = usePairTransactions(pairAddress)
  const backgroundColor = useColor(pairAddress)

  const formattedLiquidity = reserveUSD ? formattedNum(reserveUSD, true) : formattedNum(trackedReserveUSD, true)
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // volume
  const volume = !!oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : formattedNum(oneDayVolumeUntracked, true)
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked
  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked)

  const showUSDWaning = usingUntrackedLiquidity | usingUtVolume

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : '-'

  // token data for usd
  const [ethPrice] = useEthPrice()
  const token0USD =
    token0?.derivedETH && ethPrice ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true) : ''

  const token1USD =
    token1?.derivedETH && ethPrice ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true) : ''

  // rates
  const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
  const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

  // formatted symbols for overflow
  const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
  const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol

  const below1080 = useMedia('(max-width: 1080px)')
  const below900 = useMedia('(max-width: 900px)')
  const below600 = useMedia('(max-width: 600px)')

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const [savedPairs, addPair] = useSavedPairs()

  const listedTokens = useListedTokens()

  if (PAIR_BLACKLIST.includes(pairAddress)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: 'center' }}>
              {BLOCKED_WARNINGS[pairAddress] ?? `This pair is not supported.`}
            </TYPE.light>
            <Link
              external={true}
              href={'https://explorer.harmony.one/address/' + pairAddress}
            >{`More about ${shortenAddress(pairAddress)}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    )
  }

  return (
    <TWPageWrapper>
      <span />
      <Warning
        type={'pair'}
        show={!dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))}
        setShow={markAsDismissed}
        address={pairAddress}
      />
      <TWContentWrapper>
        <div className="flex justify-between w-full">
          <AutoRow align="flex-end" className="space-x-3 items-center" style={{ width: 'fit-content' }}>
            <BasicLink to="/pairs">
              <TWIconTextTitle>
                <DoubleTokenLogo a0={token0?.id || ''} a1={token1?.id || ''} size={32} />
                <p>
                  {token0?.symbol} / {token1?.symbol}
                </p>
              </TWIconTextTitle>
            </BasicLink>
            <Link
              style={{ width: 'fit-content' }}
              external
              href={'https://explorer.harmony.one/address/' + pairAddress}
            >
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                {pairAddress.slice(0, 8) + '...' + pairAddress.slice(36, 42)}
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
                  <p class="text-base">Pair Stats</p>
                </TWIconTextTitle>
                {showUSDWaning ? (
                  <HoverText text={UNTRACKED_COPY}>
                    <WarningIcon />
                  </HoverText>
                ) : null}
              </RowFixed>
            )}
            <PanelWrapper style={{ marginTop: '1.5rem' }}>
              <TWoSwapPanel className="h-1/3 px-6">
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Total Liquidity </TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {formattedLiquidity}
                    </TYPE.main>
                    <TYPE.main>{liquidityChange}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </TWoSwapPanel>
              <TWoSwapPanel className="h-1/4 px-6">
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Volume (24hrs) </TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </TYPE.main>
                    <TYPE.main>{volumeChange}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </TWoSwapPanel>
              <TWoSwapPanel className="h-1/4 px-6">
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Fees (24hrs)</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {fees}
                    </TYPE.main>
                    <TYPE.main>{volumeChange}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </TWoSwapPanel>
              <TWoSwapPanel className="h-1/4 px-6">
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Pooled Tokens</TYPE.main>
                    <div />
                  </RowBetween>
                  <Hover onClick={() => history.push(`/token/${token0?.id}`)} fade={true}>
                    <AutoRow gap="4px">
                      <TokenLogo address={token0?.id} size="32px" />
                      <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                        <RowFixed>
                          {reserve0 ? formattedNum(reserve0) : ''}{' '}
                          <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} margin={true} />
                        </RowFixed>
                      </TYPE.main>
                    </AutoRow>
                  </Hover>
                  <Hover onClick={() => history.push(`/token/${token1?.id}`)} fade={true}>
                    <AutoRow gap="4px">
                      <TokenLogo address={token1?.id} size="32px" />
                      <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                        <RowFixed>
                          {reserve1 ? formattedNum(reserve1) : ''}{' '}
                          <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} margin={true} />
                        </RowFixed>
                      </TYPE.main>
                    </AutoRow>
                  </Hover>
                </AutoColumn>
              </TWoSwapPanel>
              <TWoSwapPanel
                style={{
                  gridColumn: below1080 ? '1' : '2/4',
                  gridRow: below1080 ? '' : '1/5',
                }}
              >
                <PairChart
                  address={pairAddress}
                  color={'#1bf2ba'}
                  base0={reserve1 / reserve0}
                  base1={reserve0 / reserve1}
                />
              </TWoSwapPanel>
            </PanelWrapper>
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
            <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
              <TWIconTextTitle>
                <i class="las la-question-circle text-3xl pl-2"></i>
                <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                  Pair Information
                </TYPE.main>
              </TWIconTextTitle>
            </ListOptions>
            <TWoSwapPanel className="px-6">
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Pair Name</TYPE.main>
                  <TYPE.main style={{ marginTop: '.5rem' }}>
                    <RowFixed>
                      <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} />
                      -
                      <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} />
                    </RowFixed>
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Pair Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: '.5rem' }}>
                      {pairAddress.slice(0, 6) + '...' + pairAddress.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={pairAddress} />
                  </AutoRow>
                </Column>
                <Column>
                  <TYPE.main>
                    <RowFixed>
                      <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} />{' '}
                      <span style={{ marginLeft: '4px' }}>Address</span>
                    </RowFixed>
                  </TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: '.5rem' }}>
                      {token0 && token0.id.slice(0, 6) + '...' + token0.id.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={token0?.id} />
                  </AutoRow>
                </Column>
                <Column>
                  <TYPE.main>
                    <RowFixed>
                      <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} />{' '}
                      <span style={{ marginLeft: '4px' }}>Address</span>
                    </RowFixed>
                  </TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: '.5rem' }} fontSize={16}>
                      {token1 && token1.id.slice(0, 6) + '...' + token1.id.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={token1?.id} />
                  </AutoRow>
                </Column>
                <Link external href={'https://explorer.harmony.one/address/' + pairAddress}>
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

export default withRouter(PairPage)

{
  /* <WarningGrouping
disabled={
  !dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))
}
> */
}
