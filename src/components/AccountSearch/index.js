import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { TWButtonLight, ButtonFaded } from '../ButtonStyled'
import { RowBetween } from '../Row'
import { isAddress } from '../../utils'
import { useSavedAccounts } from '../../contexts/LocalStorage'
import { AutoColumn } from '../Column'
import { TYPE } from '../../Theme'
import { Hover, StyledIcon } from '..'
import { Divider } from '..'
import { Flex } from 'rebass'
import TWoSwapPanel from '../oSwapPanel'

import { X } from 'react-feather'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`

const TWWrapper = tw(Wrapper)`

`

const Input = styled.input`
  color: ${({ theme }) => theme.oSText2};
  background-color: ${({ theme }) => theme.bgOSwap1};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }
`

const TWInput = tw(Input)`
  relative flex items-center w-full flex-nowrap rounded-full p-3
  text-base py-2 pl-4 h-12
  border border-transparent focus:outline-none focus:ring-1 focus:ring-oswapGreen focus:border-transparent
  transition duration-500
`

const AccountLink = styled.span`
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => theme.oswapBlue.light};
  font-size: 14px;
  font-weight: 500;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  grid-template-areas: 'account';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }
`

function AccountSearch({ history, small }) {
  const [accountValue, setAccountValue] = useState()
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()

  function handleAccountSearch() {
    if (isAddress(accountValue)) {
      history.push('/account/' + accountValue)
      if (!savedAccounts.includes(accountValue)) {
        addAccount(accountValue)
      }
    }
  }

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex w-full items-center space-x-3">
        <TWWrapper>
          <TWInput
            placeholder="0x..."
            onChange={(e) => {
              setAccountValue(e.target.value)
            }}
          />
        </TWWrapper>
        <TWButtonLight className="h-12" onClick={handleAccountSearch}>Load Account Details</TWButtonLight>
      </div>

      <AutoColumn gap={'12px'}>
        {!small && (
          <TWoSwapPanel className="px-6">
            <DashGrid center={true} style={{ height: 'fit-content', padding: '0 0 1rem 0' }}>
              <TYPE.main area="account">Saved Accounts</TYPE.main>
            </DashGrid>
            <Divider />
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account) => {
                return (
                  <DashGrid key={account} center={true} style={{ height: 'fit-content', padding: '1rem 0 0 0' }}>
                    <Flex
                      area="account"
                      justifyContent="space-between"
                      onClick={() => history.push('/account/' + account)}
                    >
                      <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      <Hover
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAccount(account)
                        }}
                      >
                        <StyledIcon>
                          <i class="las la-times text-oswapGreen"></i>
                        </StyledIcon>
                      </Hover>
                    </Flex>
                  </DashGrid>
                )
              })
            ) : (
              <TYPE.light style={{ marginTop: '1rem' }}>No saved accounts</TYPE.light>
            )}
          </TWoSwapPanel>
        )}

        {small && (
          <>
            <TYPE.main>{'Accounts'}</TYPE.main>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account) => {
                return (
                  <RowBetween key={account}>
                    <ButtonFaded onClick={() => history.push('/account/' + account)}>
                      {small ? (
                        <TYPE.header>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
                      ) : (
                        <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      )}
                    </ButtonFaded>
                    <Hover onClick={() => removeAccount(account)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
            ) : (
              <TYPE.light>No pinned wallets</TYPE.light>
            )}
          </>
        )}
      </AutoColumn>
    </div>
  )
}

export default withRouter(AccountSearch)
