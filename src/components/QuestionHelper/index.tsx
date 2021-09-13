import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Popover, { PopoverProps } from '../Popover'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const TooltipContainer = styled.div`
  width: 250px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
}

export function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export default function QuestionHelper({ text, disabled, size }: { size: string, text: string; disabled?: boolean }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show && !disabled}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <i className={'las la-question-circle text-oswapGreen ' + size}></i>
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}
