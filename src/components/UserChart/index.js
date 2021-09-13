import React, { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'

import { Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, AreaChart } from 'recharts'

import { AutoRow, RowBetween } from '../Row'
import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { TWButtonLight } from '../ButtonStyled'
import { darken } from 'polished'
import { useMedia } from 'react-use'
import { timeframeOptions } from '../../constants'
import DropdownSelect from '../DropdownSelect'
import { useUserLiquidityChart } from '../../contexts/User'
import DataLoader from '../DataLoader'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { TYPE } from '../../Theme'

const ChartWrapper = styled.div`
  max-height: 390px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const TWChartWrapper = tw(ChartWrapper)`
  relative w-full items-center justify-center
`

const UserChart = ({ account }) => {
  const chartData = useUserLiquidityChart(account)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.ALL_TIME)
  let utcStartTime = getTimeframe(timeWindow)

  const below600 = useMedia('(max-width: 600px)')

  const domain = [(dataMin) => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax']

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? '#18d5bb' : '#4B5563'

  return (
    <TWChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={'#13b4ba'} />
        </RowBetween>
      ) : (
        <RowBetween mb={40}>
          <AutoRow gap="10px">
            <TYPE.main>Liquidity Value</TYPE.main>
          </AutoRow>
          <AutoRow justify="flex-end" gap="4px">
            <TWButtonLight className="h-8"
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </TWButtonLight>
            <TWButtonLight className="h-8"
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </TWButtonLight>
            <TWButtonLight className="h-8"
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </TWButtonLight>
          </AutoRow>
        </RowBetween>
      )}
      {chartData ? (
        <ResponsiveContainer width="99%" height={300}>
          <AreaChart barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#13b4ba'} stopOpacity={0.35} />
                <stop offset="95%" stopColor={'#13b4ba'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={0}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={domain}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={(tick) => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={6}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 10px',
                borderRadius: 10,
                borderColor: '#13b4ba',
                color: 'black',
              }}
              wrapperStyle={{ top: -70, left: -4 }}
            />
            <Area
              key={'other'}
              dataKey={'valueUSD'}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={'Liquidity'}
              yAxisId={0}
              stroke={darken(0.12, '#13b4ba')}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex w-full h-24 top-0 absolute">
          <DataLoader />
        </div>
      )}
    </TWChartWrapper>
  )
}

export default UserChart
