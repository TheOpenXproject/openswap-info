import React, { useEffect } from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { BasicLink } from '../Link'
import Link from '../Link'
import Logo from '../../assets/oswap_logo.png'
import { withRouter } from 'react-router-dom'

const MobileWrapper = styled.div`
  background-image: ${({ theme }) => (theme.bgGradient)}
`

const TWMobileWrapper = tw(MobileWrapper)`
  flex w-full p-3
  justify-between
  items-center
  transition-all duration-500
  z-40
`

const TWMenu = tw.div`
  flex items-center space-x-3
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
const OswapIcon = styled(Link)``

const TWOption = tw(Option)`
  flex space-x-3
`

const TWIcon = styled.div`
  color: ${({ theme }) => (theme.oSIcon1)}  
`

function TWMobileMenu({ history }) {
  
  useEffect(() => {
    var mobileHeader = document.getElementById('mobileMenu')

    document.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        mobileHeader.classList.add('shadow-xl');
      } else {
        mobileHeader.classList.remove('shadow-xl');
      }
    })
  }, []);  

  return (
    <TWMobileWrapper id="mobileMenu">
      <OswapIcon id="link" onClick={() => history.push('/')}>
        <img className="h-10" src={Logo} alt="logo" />
      </OswapIcon>
      <TWMenu>
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
      </TWMenu>
    </TWMobileWrapper>
  )
}

export default withRouter(TWMobileMenu)