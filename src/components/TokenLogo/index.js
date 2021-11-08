import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils/index.js'
import OswapLogo from '../../assets/oswap_asset.png'
import NotFound from '../../assets/coin.png'

const BAD_IMAGES = {}

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ theme }) => theme.bgOSwap1 }
  border-radius: 9999px;
`

export default function TokenLogo({ address, size = '' }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || BAD_IMAGES[address]) {
    return (
      <Image src={NotFound} size={size} />
    )
  }

  // hard coded fixes for trust wallet api issues
  if (address?.toLowerCase() === '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb') {
    address = '0x42456d7084eacf4083f1140d3229471bba2949a8'
  }

  if (address?.toLowerCase() === '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
    address = '0xc011a72400e58ecd99ee497cf89e3775d4bd732f'
  }

  if (address?.toLowerCase() === '0x01a4b054110d57069c1658afbc46730529a3e326') {
    return (
      <Image src={OswapLogo} size={size} />
    )
  }

  let path = 'https://openfi.dev/tokens/byAddress/' + address.toLowerCase() + '.png'


  return (
    <Image
      src={path}
      size={size}
      onError={(event) => {
        BAD_IMAGES[address] = true
        setError(true)
        event.preventDefault()
      }}
    />
  )
}
