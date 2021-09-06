import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { AutoColumn } from '../Column'
import Title from '../Title'
import { BasicLink } from '../Link'
import { useMedia } from 'react-use'
import { TYPE } from '../../Theme'
import { withRouter } from 'react-router-dom'
import Link from '../Link'
import { useSessionStart } from '../../contexts/Application'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import Toggle from '../Toggle'

const Wrapper = styled.div`
  height: ${({ isMobile }) => (isMobile ? 'initial' : '100vh')};
  z-index: 9999;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    position: relative;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`

const TWWrapper = tw(Wrapper)`
  sticky
  top-0
  box-border
`

const Menu = styled.div`
  // background-image: ${({ theme }) => (theme.bgComponentGradient)}
`

const TWMenu = tw(Menu)`
  flex flex-col
  mt-3 p-6
  rounded-2xl
`

const TWMenuMiddle = tw.div`
  flex flex-col pb-6 space-y-1
`

const TWMenuBottom = tw.div`
  fixed bottom-0 left-0
  flex flex-col
  p-6
`

const Option = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: ${({ activeText }) => (activeText ? 1 : 0.7)};
  color: ${({ theme }) => theme.oSText1};
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

const DesktopWrapper = tw.div`
  flex
  flex-col
  h-screen
`

const MobileWrapper = tw.div`
  flex
  justify-between
  items-center
`

const HeaderText = styled.div`
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.oSText1};
  }
`

const TWHeaderText = tw(HeaderText)`
  flex items-center space-x-3 text-xs
`

const Polling = styled.div`
  color: ${({ theme }) => (theme.oSText1) };
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`

const TWPolling = tw(Polling)`
  flex items-center space-x-3
`

function SideNav({ history }) {
  const below1080 = useMedia('(max-width: 1080px)')

  const below1180 = useMedia('(max-width: 1180px)')

  const seconds = useSessionStart()

  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <TWWrapper isMobile={below1080}>
      {!below1080 ? (
        <DesktopWrapper>
          <TWMenu>
            <Title />
            {!below1080 && (
              <AutoColumn gap="1.25rem" style={{ marginTop: '1.5rem' }}>
                <BasicLink to="/home">
                  <TWOption activeText={history.location.pathname === '/home' ?? undefined}>
                    <TWIcon>
                      <i class="las la-chart-line text-xl"></i>
                    </TWIcon>
                    <p>Overview</p>
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
                    <p>Tokens</p>
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
                    <p>Pairs</p>
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
                    <p>Accounts</p>
                  </TWOption>
                </BasicLink>
                <TWPolling>
                  <i class="las la-clock text-xl text-oswapGreen-dark"></i>
                  <a href="/">
                    <TYPE.small>
                      Updated {!!seconds ? seconds + 's' : '-'} ago <br />
                    </TYPE.small>
                  </a>
                </TWPolling>
              </AutoColumn>
            )}
          </TWMenu>
          <TWMenuBottom>
            <TWMenuMiddle>
              <TWHeaderText>
                <Link className="flex items-center space-x-3" href="https://openswap.one" target="_blank">
                  <i class="las la-link text-lg"></i>
                  <p>Openswap.one</p>
                </Link>
              </TWHeaderText>
              <TWHeaderText>
                <Link className="flex items-center space-x-3" href="https://docs.openswap.one/" target="_blank">
                  <i class="las la-book text-lg"></i>
                  <p>Docs</p>
                </Link>
              </TWHeaderText>
              <TWHeaderText>
                <Link className="flex items-center space-x-3" href="https://discord.gg/hznnXUxert" target="_blank">
                  <i class="lab la-discord text-lg"></i>
                  <p>Discord</p>
                </Link>
              </TWHeaderText>
              <TWHeaderText>
                <Link className="flex items-center space-x-3" href="https://twitter.com/OpenSwap_one" target="_blank">
                  <i class="lab la-twitter text-lg"></i>
                  <p>Twitter</p>
                </Link>
              </TWHeaderText>
            </TWMenuMiddle>
            <Toggle isActive={isDark} toggle={toggleDarkMode} />
          </TWMenuBottom>
        </DesktopWrapper>
      ) : (
        <MobileWrapper>
          <Title />
        </MobileWrapper>
      )}
    </TWWrapper>
  )
}

export default withRouter(SideNav)
