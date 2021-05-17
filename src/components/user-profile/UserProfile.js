import React from 'react'
import { Link, useParams } from 'react-router-dom'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

import BarChart from 'components/common/bar-chart'
import ChartContainer from 'components/common/chart-container'
import LineChart from 'components/common/line-chart/LineChart'
import PieChart from 'components/common/pie-chart'

import { postsByMonths, postsLikelyTopics } from 'utils/postsUtils'

import './style.css'

const UserProfile = ({ authors, selectedYear, months }) => {
  const { authorId } = useParams()
  const author = authors?.[authorId]
  const topics = postsLikelyTopics(author?.posts)
  const postingFrequency = postsByMonths(author?.posts, selectedYear).map((posts, index) => ({
    x: months[index],
    y: posts.length,
  }))
  const authorPostsByMonths = postsByMonths(author?.posts, selectedYear)
  const trends = {}
  authorPostsByMonths
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
  return (
    <div className="userProfile">
      <Link to="/">Home</Link> / author / {author?.firstName} {author?.lastName}
      <div className="userProfile__user">
        <img
          className="user__img"
          src={author?.avatar}
          alt={`${author?.firstName} ${author?.lastName}`}
        />
        <div className="user__text">
          <div className="user__primaryText">
            {author?.firstName}
            {author?.lastName}
          </div>
          <div className="user__secondaryText">{author?.email}</div>
        </div>
      </div>
      <div className="userProfile__row">
        <ChartContainer title={`All Posts by ${selectedYear} Months`}>
          <ParentSize>
            {({ width, height }) => (
              <BarChart
                width={width}
                height={height}
                data={authorPostsByMonths.map((month, index) => [
                  { unit: 'month', value: months[index] },
                  { unit: 'post', value: month.length },
                ])}
              />
            )}
          </ParentSize>
        </ChartContainer>
        <ChartContainer title={`Topics Distribution`}>
          <ParentSize>
            {({ width, height }) => <PieChart width={width} height={height} data={topics} />}
          </ParentSize>
        </ChartContainer>
      </div>
      <div className="userProfile__row">
        <ChartContainer title={`Trending Topics in ${selectedYear}`}>
          <ParentSize>
            {({ width, height }) => (
              <LineChart
                width={width}
                height={height}
                data={Object.entries(trends).map(([title, values]) => ({
                  unit: 'topic',
                  title,
                  values,
                }))}
                unit="%"
              />
            )}
          </ParentSize>
        </ChartContainer>
        <ChartContainer title="Posting Frequency">
          <ParentSize>
            {({ width, height }) => (
              <LineChart
                width={width}
                height={height}
                data={[{ unit: 'topic', title: 'Posting Frequency', values: postingFrequency }]}
              />
            )}
          </ParentSize>
        </ChartContainer>
      </div>
    </div>
  )
}

export default UserProfile
