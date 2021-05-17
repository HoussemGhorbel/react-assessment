import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'

import UserProfile from 'components/user-profile'
import Home from 'components/home'

import './style.css'

const allPosts = loader('utils/graphql/allPosts.gql')

const samples = 100

const availableYears = [2019, 2020, 2021]

const App = () => {
  const { data } = useQuery(allPosts, { variables: { count: samples } })
  const [selectedYear, setSelectedYear] = useState(availableYears[0])
  console.log(`data`, data)
  return (
    <div className="app">
      <div className="app__header">
        <div>Please select the year</div>
        <select
          className="app__yearSelector"
          onChange={(e) => setSelectedYear(+e.target.value)}
          value={selectedYear}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <Router>
        <Switch>
          <Route path="/author/:authorId">
            <UserProfile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
