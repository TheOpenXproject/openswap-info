import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { Text } from 'rebass'
import { RowBetween, RowFixed } from '../Row'
import { ButtonDark } from '../ButtonStyled'
import { AutoColumn } from '../Column'
import { Hover } from '..'
import Link from '../Link'
import { useMedia } from 'react-use'

const WarningWrapper = styled.div`
  display: ${({ show }) => !show && 'none'};
`

const TWWarningWrapper = tw(WarningWrapper)`
  relative rounded-3xl mb-3 p-4
  bg-red-300 text-red-500 bg-opacity-20
`

export default function Warning({ type, show, setShow, address }) {
  const below800 = useMedia('(max-width: 800px)')

  const textContent = below800 ? (
    <div>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        Anyone can create and name any ERC20 token on Harmony, including creating fake versions of existing tokens and
        tokens that claim to represent projects that do not have a token.
      </Text>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        Similar to the Explorer, this site automatically tracks analytics for all ERC20 tokens independent of token
        integrity. Please do your own research before interacting with any ERC20 token.
      </Text>
    </div>
  ) : (
    <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
      Anyone can create and name any ERC20 token on Harmony, including creating fake versions of existing tokens and
      tokens that claim to represent projects that do not have a token. Similar to the Explorer, this site automatically
      tracks analytics for all ERC20 tokens independent of token integrity. Please do your own research before
      interacting with any ERC20 token.
    </Text>
  )

  return (
    <TWWarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <i class="las la-exclamation-triangle text-3xl"></i>
          <Text fontWeight={600} lineHeight={'145.23%'} ml={'10px'}>
            Token Safety Alert
          </Text>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: '10px' }}>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#109dbb'}
                href={'https://explorer.harmony.one/address/' + address}
                target="_blank"
              >
                View {type === 'token' ? 'token' : 'pair'} contract on the Explorer
              </Link>
            </Hover>
            <RowBetween style={{ marginTop: '20px' }}>
              <div />
              <ButtonDark color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
                I understand
              </ButtonDark>
            </RowBetween>
          </div>
        ) : (
          <RowBetween style={{ marginTop: '10px' }}>
            <Hover>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#109dbb'}
                href={'https://explorer.harmony.one/address/' + address}
                target="_blank"
              >
                View {type === 'token' ? 'token' : 'pair'} contract on the Explorer
              </Link>
            </Hover>
            <ButtonDark color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
              I understand
            </ButtonDark>
          </RowBetween>
        )}
      </AutoColumn>
    </TWWarningWrapper>
  )
}
