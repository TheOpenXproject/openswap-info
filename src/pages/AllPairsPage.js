import React, { useEffect, useState } from 'react'

import { useAllPairData } from '../contexts/PairData'
import PairList from '../components/PairList'
import { AutoRow } from '../components/Row'
import { TWPageWrapper, TWContentWrapper } from '../components'
import TWoSwapPanel from '../components/oSwapPanel'
import Search from '../components/Search'
import { useMedia } from 'react-use'
import QuestionHelper from '../components/QuestionHelper'
import TWCheckbox from '../components/TWCheckbox'

import styled from 'styled-components'
import tw from 'tailwind-styled-components'

const IconTextTitle = styled.div`
  color: ${({ theme }) => theme.oSText1};

  i {
    color: ${({ theme }) => theme.oSIcon2}
  }
`

const TWIconTextTitle = tw(IconTextTitle)`
  flex items-center space-x-3
`

function AllPairsPage() {
  const allPairs = useAllPairData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  const [useTracked, setUseTracked] = useState(true)

  return (
    <TWPageWrapper>
      <TWContentWrapper>
        <div className="flex w-full items-center justify-between mb-6">
          <TWIconTextTitle>
            <i class="las la-trophy text-3xl"></i>
            <p class="text-3xl">Top Pairs</p>
          </TWIconTextTitle>
          {!below800 && <Search small={true} />}
        </div>
        <div className="flex w-full flex-col pb-6">
          <AutoRow gap="4px">
            <TWCheckbox 
              label="Hide untracked pairs"
              value="value"
              checked={useTracked}
              setChecked={() => setUseTracked(!useTracked)}
            />
            <QuestionHelper size="text-2xl" text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ONE or stablecoins." />
          </AutoRow>
        </div>
        <TWoSwapPanel>
          <PairList pairs={allPairs} disbaleLinks={true} maxItems={50} useTracked={useTracked} />
        </TWoSwapPanel>
      </TWContentWrapper>
    </TWPageWrapper>
  )
}

export default AllPairsPage
