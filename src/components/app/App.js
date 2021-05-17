import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import Info from 'luxon/src/info'

import Home from 'components/home'
import UserProfile from 'components/user-profile'

import { postsByMonths, postsLikelyTopics } from 'utils/postsUtils'

import './style.css'

const allPosts = loader('utils/graphql/allPosts.gql')

const samples = 100

const months = Info.months('short')
const availableYears = [2019, 2020, 2021]

const App = () => {
  const { data } = useQuery(allPosts, { variables: { count: samples } })
  const [selectedYear, setSelectedYear] = useState(availableYears[0])

  const allPostsByMonths = postsByMonths(data?.allPosts, selectedYear)

  const trends = {}
  allPostsByMonths
    .map((month) => postsLikelyTopics(month))
    .forEach((month, index) => {
      month.forEach(({ label, likelihood }) => {
        if (trends[label]) {
          trends[label].push({
            position: index,
            x: months[index],
            y: +(likelihood * 100).toFixed(2),
          })
        } else {
          trends[label] = [{ position: index, x: months[index], y: +(likelihood * 100).toFixed(2) }]
        }
      })
    })

  const authors = data?.allPosts
    ?.filter(
      (post, index) =>
        index === data?.allPosts.findIndex(({ author: { id } }) => post?.author?.id === id)
    )
    .reduce(
      (prev, { author }) => Object.assign(prev, { [author.id]: { ...author, posts: [] } }),
      {}
    )

  data?.allPosts?.forEach((post) => authors[post?.author?.id].posts.push(post))

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
            <UserProfile authors={authors} selectedYear={selectedYear} months={months} />
          </Route>
          <Route path="/">
            <Home
              allPostsByMonths={allPostsByMonths}
              trends={trends}
              authors={authors}
              months={months}
              selectedYear={selectedYear}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
