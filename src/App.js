import React, { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { ApolloProvider } from 'react-apollo'
import { client } from './apollo/client'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import GlobalPage from './pages/GlobalPage'
import TokenPage from './pages/TokenPage'
import PairPage from './pages/PairPage'
import { useGlobalData, useGlobalChartData } from './contexts/GlobalData'
import { isAddress } from './utils'
import AccountPage from './pages/AccountPage'
import AllTokensPage from './pages/AllTokensPage'
import AllPairsPage from './pages/AllPairsPage'
import PinnedData from './components/PinnedData'

import SideNav from './components/SideNav'
import AccountLookup from './pages/AccountLookup'
import LocalLoader from './components/LocalLoader'
import { useLatestBlocks } from './contexts/Application'
import GoogleAnalyticsReporter from './components/analytics/GoogleAnalyticsReporter'
import { PAIR_BLACKLIST, TOKEN_BLACKLIST } from './constants'

const TWAppWrapper = tw.div`
  position: relative;
  width: 100%;
  flex relative
  w-full
`

const TWContentWrapper = tw.div`
  flex flex-col w-full lg:flex-row lg:max-w-screen-xl mx-auto
`

const Right = styled.div`
  position: fixed;
  right: 0;
  bottom: 0rem;
  z-index: 99;
  width: ${({ open }) => (open ? '220px' : '64px')};
  height: ${({ open }) => (open ? 'fit-content' : '64px')};
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  @media screen and (max-width: 1400px) {
    display: none;
  }
`

const Center = styled.div`
  transition: width 0.25s ease;
`

const TWCenter = tw(Center)`
  h-full w-full
  z-30 px-3
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: #ff6871;
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

/**
 * Wrap the component with the header and sidebar pinned tab
 */
const LayoutWrapper = ({ children, savedOpen, setSavedOpen }) => {
  return (
    <>
      <TWContentWrapper open={savedOpen}>
        <SideNav />
        <TWCenter id="center">{children}</TWCenter>
      </TWContentWrapper>
    </>
  )
}

const BLOCK_DIFFERENCE_THRESHOLD = 600

function App() {
  const [savedOpen, setSavedOpen] = useState(false)

  const globalData = useGlobalData()
  const globalChartData = useGlobalChartData()
  const [latestBlock, headBlock] = useLatestBlocks()

  // show warning
  const showWarning = headBlock && latestBlock ? headBlock - latestBlock > BLOCK_DIFFERENCE_THRESHOLD : false

  // return (
  //   <ApolloProvider client={client}>
  //     <AppWrapper>
  //       {showWarning && (
  //         <WarningWrapper>
  //           <WarningBanner>
  //             {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
  //           </WarningBanner>
  //         </WarningWrapper>
  //       )}
  //       {globalData &&
  //       Object.keys(globalData).length > 0 &&
  //       globalChartData &&
  //       Object.keys(globalChartData).length > 0 ? (
  //         <BrowserRouter>
  //           <Route component={GoogleAnalyticsReporter} />
  //           <Switch>
  //             <Route
  //               exacts
  //               strict
  //               path="/token/:tokenAddress"
  //               render={({ match }) => {
  //                 if (
  //                   isAddress(match.params.tokenAddress.toLowerCase()) &&
  //                   !Object.keys(TOKEN_BLACKLIST).includes(match.params.tokenAddress.toLowerCase())
  //                 ) {
  //                   return (
  //                     <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                       <TokenPage address={match.params.tokenAddress.toLowerCase()} />
  //                     </LayoutWrapper>
  //                   )
  //                 } else {
  //                   return <Redirect to="/home" />
  //                 }
  //               }}
  //             />
  //             <Route
  //               exacts
  //               strict
  //               path="/pair/:pairAddress"
  //               render={({ match }) => {
  //                 if (
  //                   isAddress(match.params.pairAddress.toLowerCase()) &&
  //                   !Object.keys(PAIR_BLACKLIST).includes(match.params.pairAddress.toLowerCase())
  //                 ) {
  //                   return (
  //                     <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                       <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
  //                     </LayoutWrapper>
  //                   )
  //                 } else {
  //                   return <Redirect to="/home" />
  //                 }
  //               }}
  //             />
  //             <Route
  //               exacts
  //               strict
  //               path="/account/:accountAddress"
  //               render={({ match }) => {
  //                 if (isAddress(match.params.accountAddress.toLowerCase())) {
  //                   return (
  //                     <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                       <AccountPage account={match.params.accountAddress.toLowerCase()} />
  //                     </LayoutWrapper>
  //                   )
  //                 } else {
  //                   return <Redirect to="/home" />
  //                 }
  //               }}
  //             />

  //             <Route path="/home">
  //               <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                 <GlobalPage />
  //               </LayoutWrapper>
  //             </Route>

  //             <Route path="/tokens">
  //               <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                 <AllTokensPage />
  //               </LayoutWrapper>
  //             </Route>

  //             <Route path="/pairs">
  //               <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                 <AllPairsPage />
  //               </LayoutWrapper>
  //             </Route>

  //             <Route path="/accounts">
  //               <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
  //                 <AccountLookup />
  //               </LayoutWrapper>
  //             </Route>

  //             <Redirect to="/home" />
  //           </Switch>
  //         </BrowserRouter>
  //       ) : (
  //         <LocalLoader fill="true" />
  //       )}
  //     </AppWrapper>
  //   </ApolloProvider>
  // )
  return (
    <ApolloProvider client={client}>
      <TWAppWrapper>
        {showWarning && (
          <WarningWrapper>
            <WarningBanner>
              {`Warning: The data on this site has only synced to Harmony block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
            </WarningBanner>
          </WarningWrapper>
        )}

        {globalData && Object.keys(globalData).length > 0 && globalChartData && Object.keys(globalChartData).length > 0}

        {true ? (
          <BrowserRouter>
            <Route component={GoogleAnalyticsReporter} />
            <Switch>
              <Route
                exacts
                strict
                path="/token/:tokenAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.tokenAddress.toLowerCase()) &&
                    !Object.keys(TOKEN_BLACKLIST).includes(match.params.tokenAddress.toLowerCase())
                  ) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <TokenPage address={match.params.tokenAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/pair/:pairAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.pairAddress.toLowerCase()) &&
                    !Object.keys(PAIR_BLACKLIST).includes(match.params.pairAddress.toLowerCase())
                  ) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/account/:accountAddress"
                render={({ match }) => {
                  if (isAddress(match.params.accountAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <AccountPage account={match.params.accountAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />

              <Route path="/home">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <GlobalPage />
                </LayoutWrapper>
              </Route>

              <Route path="/tokens">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AllTokensPage />
                </LayoutWrapper>
              </Route>

              <Route path="/pairs">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AllPairsPage />
                </LayoutWrapper>
              </Route>

              <Route path="/accounts">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AccountLookup />
                </LayoutWrapper>
              </Route>

              <Redirect to="/home" />
            </Switch>
          </BrowserRouter>
        ) : (
          <LocalLoader />
        )}
      </TWAppWrapper>
    </ApolloProvider>
  )
}

export default App
