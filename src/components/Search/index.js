import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'

import Row, { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { Search as SearchIcon, X } from 'react-feather'
import { BasicLink } from '../Link'

import { useAllTokenData, useTokenData } from '../../contexts/TokenData'
import { useAllPairData, usePairData } from '../../contexts/PairData'
import DoubleTokenLogo from '../DoubleLogo'
import { useMedia } from 'react-use'
import { useAllPairsInUniswap, useAllTokensInUniswap } from '../../contexts/GlobalData'
import { TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../constants'

import { transparentize } from 'polished'
import { client } from '../../apollo/client'
import { PAIR_SEARCH, TOKEN_SEARCH } from '../../apollo/queries'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { updateNameData } from '../../utils/data'

const Container = styled.div`
  height: 54px;
`

const TWContainer = tw(Container)`
  relative z-30
`

const Wrapper = styled.div`
  background: ${({ theme, small, open }) => (small ? (open ? theme.bgOSwap1 : 'none') : theme.bgOSwap1)};

  border-top-right-radius: ${({ open }) => (open ? '24px' : '9999px')};
  border-top-left-radius: ${({ open }) => (open ? '24px' : '9999px')};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '9999px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '9999px')};

  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
    !open && !small
      ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
      : 'none'};
`

const TWWrapper = tw(Wrapper)`
  flex flex-row relative 
  items-center justify-end p-3 pl-4
`

const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.oSText2};
  font-size: ${({ large }) => (large ? '20px' : '14px')};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: ${({ theme }) => theme.oswapGreen.DEFAULT};
`

const CloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.oswapGreen.DEFAULT};
  :hover {
    cursor: pointer;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 540px;
  overflow: auto;
  left: 0;
  padding-bottom: 20px;
  background: ${({ theme }) => theme.bgOSwap1};
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};
`

const MenuItem = styled(Row)`
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.oSHover1};
  }
`

const TWMenuItem = tw(MenuItem)`
  flex space-x-3 items-center p-3
`

const Heading = styled(Row)`
  padding: 1rem;
  display: ${({ hide = false }) => hide && 'none'};
`

const Gray = styled.span`
  color: ${({ theme }) => (theme.oswapGreen.dark)};;
`

const Blue = styled.span`
  color: ${({ theme }) => theme.oswapBlue.light};
  :hover {
    cursor: pointer;
  }
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

export const Search = ({ small = false }) => {
  let allTokens = useAllTokensInUniswap()
  const allTokenData = useAllTokenData()

  let allPairs = useAllPairsInUniswap()
  const allPairData = useAllPairData()

  const [showMenu, toggleMenu] = useState(false)
  const [value, setValue] = useState('')
  const [, toggleShadow] = useState(false)
  const [, toggleBottomShadow] = useState(false)

  // fetch new data on tokens and pairs if needed
  useTokenData(value)
  usePairData(value)

  const below700 = useMedia('(max-width: 700px)')
  const below470 = useMedia('(max-width: 470px)')
  const below410 = useMedia('(max-width: 410px)')

  useEffect(() => {
    if (value !== '') {
      toggleMenu(true)
    } else {
      toggleMenu(false)
    }
  }, [value])

  const [searchedTokens, setSearchedTokens] = useState([])
  const [searchedPairs, setSearchedPairs] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        if (value?.length > 0) {
          let tokens = await client.query({
            query: TOKEN_SEARCH,
            variables: {
              value: value ? value.toUpperCase() : '',
              id: value,
            },
          })

          let pairs = await client.query({
            query: PAIR_SEARCH,
            variables: {
              tokens: tokens.data.asSymbol?.map((t) => t.id),
              id: value,
            },
          })

          setSearchedPairs(
            updateNameData(pairs.data.as0)
              .concat(updateNameData(pairs.data.as1))
              .concat(updateNameData(pairs.data.asAddress))
          )
          const foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
          setSearchedTokens(foundTokens)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [value])

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  // add the searched tokens to the list if not found yet
  allTokens = allTokens.concat(
    searchedTokens.filter((searchedToken) => {
      let included = false
      updateNameData()
      allTokens.map((token) => {
        if (token.id === searchedToken.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniqueTokens = []
  let found = {}
  allTokens &&
    allTokens.map((token) => {
      if (!found[token.id]) {
        found[token.id] = true
        uniqueTokens.push(token)
      }
      return true
    })

  allPairs = allPairs.concat(
    searchedPairs.filter((searchedPair) => {
      let included = false
      allPairs.map((pair) => {
        if (pair.id === searchedPair.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniquePairs = []
  let pairsFound = {}
  allPairs &&
    allPairs.map((pair) => {
      if (!pairsFound[pair.id]) {
        pairsFound[pair.id] = true
        uniquePairs.push(pair)
      }
      return true
    })

  const filteredTokenList = useMemo(() => {
    return uniqueTokens
      ? uniqueTokens
          .sort((a, b) => {
            const tokenA = allTokenData[a.id]
            const tokenB = allTokenData[b.id]
            if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1
            }
            if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
              return -1
            }
            if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1
            }
            return 1
          })
          .filter((token) => {
            if (TOKEN_BLACKLIST.includes(token.id)) {
              return false
            }
            const regexMatches = Object.keys(token).map((tokenEntryKey) => {
              const isAddress = value.slice(0, 2) === '0x'
              if (tokenEntryKey === 'id' && isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'symbol' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'name' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              return false
            })
            return regexMatches.some((m) => m)
          })
      : []
  }, [allTokenData, uniqueTokens, value])

  const filteredPairList = useMemo(() => {
    return uniquePairs
      ? uniquePairs
          .sort((a, b) => {
            const pairA = allPairData[a.id]
            const pairB = allPairData[b.id]
            if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return parseFloat(pairA.trackedReserveETH) > parseFloat(pairB.trackedReserveETH) ? -1 : 1
            }
            if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
              return -1
            }
            if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return 1
            }
            return 0
          })
          .filter((pair) => {
            if (PAIR_BLACKLIST.includes(pair.id)) {
              return false
            }
            if (value && value.includes(' ')) {
              const pairA = value.split(' ')[0]?.toUpperCase()
              const pairB = value.split(' ')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            if (value && value.includes('-')) {
              const pairA = value.split('-')[0]?.toUpperCase()
              const pairB = value.split('-')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            const regexMatches = Object.keys(pair).map((field) => {
              const isAddress = value.slice(0, 2) === '0x'
              if (field === 'id' && isAddress) {
                return pair[field].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (field === 'token0') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              if (field === 'token1') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              return false
            })
            return regexMatches.some((m) => m)
          })
      : []
  }, [allPairData, uniquePairs, value])

  useEffect(() => {
    if (Object.keys(filteredTokenList).length > 2) {
      toggleShadow(true)
    } else {
      toggleShadow(false)
    }
  }, [filteredTokenList])

  useEffect(() => {
    if (Object.keys(filteredPairList).length > 2) {
      toggleBottomShadow(true)
    } else {
      toggleBottomShadow(false)
    }
  }, [filteredPairList])

  const [tokensShown, setTokensShown] = useState(3)
  const [pairsShown, setPairsShown] = useState(3)

  function onDismiss() {
    setPairsShown(3)
    setTokensShown(3)
    toggleMenu(false)
    setValue('')
  }

  // refs to detect clicks outside modal
  const wrapperRef = useRef()
  const menuRef = useRef()

  const handleClick = (e) => {
    if (
      !(menuRef.current && menuRef.current.contains(e.target)) &&
      !(wrapperRef.current && wrapperRef.current.contains(e.target))
    ) {
      setPairsShown(3)
      setTokensShown(3)
      toggleMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  return (
    <TWContainer small={small}>
      <TWWrapper open={showMenu} shadow={true} small={small}>
        <Input
          large={!small}
          type={'text'}
          ref={wrapperRef}
          placeholder={
            small
              ? 'Search...'
              : below410
              ? 'Search...'
              : below470
              ? 'Search OpenSwap...'
              : below700
              ? 'Search pairs and tokens...'
              : 'Search OpenSwap pairs and tokens...'
          }
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onFocus={() => {
            if (!showMenu) {
              toggleMenu(true)
            }
          }}
        />
        {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={() => toggleMenu(false)} />}
      </TWWrapper>
      <Menu hide={!showMenu} ref={menuRef}>
        <Heading>
          <TWIconTextTitle>
            <i class="las la-spinner text-2xl"></i>
            <p>Pairs</p>
          </TWIconTextTitle>
        </Heading>
        <div>
          {filteredPairList && Object.keys(filteredPairList).length === 0 && (
            <TWMenuItem>
              <TYPE.body>No results</TYPE.body>
            </TWMenuItem>
          )}
          {filteredPairList &&
            filteredPairList.slice(0, pairsShown).map((pair) => {
              //format incorrect names
              updateNameData(pair)
              return (
                <BasicLink to={'/pair/' + pair.id} key={pair.id} onClick={onDismiss}>
                  <TWMenuItem>
                    <DoubleTokenLogo a0={pair?.token0?.id} a1={pair?.token1?.id} size={32} />
                    <TYPE.body>
                      {pair.token0.symbol + '-' + pair.token1.symbol} Pair
                    </TYPE.body>
                  </TWMenuItem>
                </BasicLink>
              )
            })}
          <Heading
            hide={!(Object.keys(filteredPairList).length > 3 && Object.keys(filteredPairList).length >= pairsShown)}
          >
            <Blue
              onClick={() => {
                setPairsShown(pairsShown + 5)
              }}
            >
              See more...
            </Blue>
          </Heading>
        </div>
        <Heading>
          <TWIconTextTitle>
            <i class="las la-coins text-2xl"></i>
            <p>Tokens</p>
          </TWIconTextTitle>
        </Heading>
        <div>
          {Object.keys(filteredTokenList).length === 0 && (
            <TWMenuItem>
              <TYPE.body>No results</TYPE.body>
            </TWMenuItem>
          )}
          {filteredTokenList.slice(0, tokensShown).map((token) => {
            // update displayed names
            updateNameData({ token0: token })
            return (
              <BasicLink to={'/token/' + token.id} key={token.id} onClick={onDismiss}>
                <TWMenuItem>
                    <TokenLogo address={token.id} size="40px" />
                    <FormattedName text={token.name} maxCharacters={20} />
                </TWMenuItem>
              </BasicLink>
            )
          })}

          <Heading
            hide={!(Object.keys(filteredTokenList).length > 3 && Object.keys(filteredTokenList).length >= tokensShown)}
          >
            <Blue
              onClick={() => {
                setTokensShown(tokensShown + 5)
              }}
            >
              See more...
            </Blue>
          </Heading>
        </div>
      </Menu>
    </TWContainer>
  )
}

export default Search
