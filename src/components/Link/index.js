import React from 'react'
import { Link as RebassLink } from 'rebass'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { lighten, darken } from 'polished'

const WrappedLink = ({ external, children, ...rest }) => (
  <RebassLink
    target={external ? '_blank' : null}
    rel={external ? 'noopener noreferrer' : null}
    color="#109dbb"
    {...rest}
  >
    {children}
  </RebassLink>
)

WrappedLink.propTypes = {
  external: PropTypes.bool,
}

const Link = styled(WrappedLink)`
  color: ${({ theme }) => theme.oswapBlue.light};
`

export default Link

export const CustomLink = styled(RouterLink)`
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: ${({ color, theme }) => (color ? color : theme.oswapBlue.light)};

  &:visited {
    color: ${({ color, theme }) => (color ? lighten(0.1, color) : lighten(0.1, theme.oswapBlue.light))};
  }

  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
    color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.oswapBlue.light))};
  }
`

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.oswapBlue.light }
  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
  }
`
