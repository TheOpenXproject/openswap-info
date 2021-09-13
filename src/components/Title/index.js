import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { Flex } from 'rebass'
import Link from '../Link'
import { RowFixed } from '../Row'
import Logo from '../../assets/oswap_logo.png'
import { BasicLink } from '../Link'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'

const TitleWrapper = styled.div`
  text-decoration: none;
  z-index: 10;
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`

const OswapIcon = styled(Link)``

const Option = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: ${({ activeText }) => (activeText ? 1 : 0.6)};
  color: ${({ theme }) => theme.white};
  display: flex;
  margin-left: 12px;
  :hover {
    opacity: 1;
  }
`

const TWOption = tw(Option)`
  flex space-x-3
`

const TWIcon = styled.div`
  color: ${({ theme }) => (theme.oSIcon1)}  
`

function Title() {
  const history = useHistory()
  const below1024 = useMedia('(max-width: 1024px)')

  return (
    <TitleWrapper onClick={() => history.push('/')}>
      <Flex alignItems="center" style={{ justifyContent: 'space-between' }}>
        <RowFixed>
          <OswapIcon id="link" onClick={() => history.push('/')}>
            <img className="h-10" src={Logo} alt="logo" />
          </OswapIcon>
        </RowFixed>
        {below1024 && (
          <RowFixed style={{ alignItems: 'flex-end' }}>
            <BasicLink to="/home">
              <TWOption activeText={history.location.pathname === '/home' ?? undefined}>
                <TWIcon>
                  <i class="las la-chart-line text-xl"></i>
                </TWIcon>
                <p class="ss:hidden xs:block">Overview</p>
              </TWOption>
            </BasicLink>
            <BasicLink to="/tokens">
              <TWOption
                activeText={
                  (history.location.pathname.split('/')[1] === 'tokens' ||
                    history.location.pathname.split('/')[1] === 'token') ??
                  undefined
                }
              >
                <TWIcon>
                  <i class="las la-coins text-xl"></i>
                </TWIcon>
                <p class="ss:hidden xs:block">Tokens</p>
              </TWOption>
            </BasicLink>
            <BasicLink to="/pairs">
              <TWOption
                activeText={
                  (history.location.pathname.split('/')[1] === 'pairs' ||
                    history.location.pathname.split('/')[1] === 'pair') ??
                  undefined
                }
              >
                <TWIcon>
                  <i class="las la-spinner text-xl"></i>
                </TWIcon>
                <p class="ss:hidden xs:block">Pairs</p>
              </TWOption>
            </BasicLink>

            <BasicLink to="/accounts">
              <TWOption
                activeText={
                  (history.location.pathname.split('/')[1] === 'accounts' ||
                    history.location.pathname.split('/')[1] === 'account') ??
                  undefined
                }
              >
                <TWIcon>
                  <i class="las la-user text-xl"></i>
                </TWIcon>
                <p class="ss:hidden xs:block">Accounts</p>
              </TWOption>
            </BasicLink>
          </RowFixed>
        )}
      </Flex>
    </TitleWrapper>
  )
}

export default withRouter(Title)
